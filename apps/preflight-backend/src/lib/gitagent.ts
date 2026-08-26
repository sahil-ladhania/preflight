/**
 * gitagent — sole in-process query() gateway.
 * Why: locked defaults for all agents (13-agent-architecture.md §6, doc 19 §7.4).
 */
import { createHash } from "node:crypto";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { query } from "@open-gitagent/gitagent";
import type { GCAssistantMessage, GCToolDefinition, Query } from "@open-gitagent/gitagent";

import { env } from "../config/env.js";
import { buildAgentSkillSuffix, extractReadPath } from "./agent-skills.js";
import { getAgentToolPolicy } from "./agent-tool-policy.js";
import { createReadTool } from "./agent-tools.js";
import {
  buildAgentSystemPrompt,
  readAgentRuntimeConfig,
} from "./agent-dir.js";

export type AgentName = "extractor" | "generator" | "judge" | "explainer";

export interface AgentRunMeta {
  agentName: AgentName;
  agentDefVersion: string;
  model: string;
  prompt: string;
  output: string;
  promptHash: string;
  outputHash: string;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  costUsd: number | null;
  latencyMs: number;
  skillsRead: string[];
  ok: boolean;
  errorKind: string | null;
}

export interface RunAgentResult {
  content: string;
  skillsRead: string[];
  usage?: GCAssistantMessage["usage"];
  meta: AgentRunMeta;
}

export interface RunAgentOptions {
  timeoutMs?: number;
  skillNames?: string[];
  skillLoad?: "catalog" | "dump";
}

export class AgentInvocationError extends Error {
  readonly meta: AgentRunMeta;

  constructor(message: string, meta: AgentRunMeta) {
    super(message);
    this.name = "AgentInvocationError";
    this.meta = meta;
  }
}

const DEFAULT_TIMEOUT_MS = 60_000;

export function hashAgentText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export function buildAgentRunMeta(input: {
  agentName: AgentName;
  agentDefVersion: string;
  model: string;
  prompt: string;
  output: string;
  latencyMs: number;
  skillsRead: string[];
  usage?: GCAssistantMessage["usage"];
  ok: boolean;
  errorKind: string | null;
}): AgentRunMeta {
  return {
    agentName: input.agentName,
    agentDefVersion: input.agentDefVersion,
    model: input.model,
    prompt: input.prompt,
    output: input.output,
    promptHash: hashAgentText(input.prompt),
    outputHash: hashAgentText(input.output),
    inputTokens: input.usage?.inputTokens ?? null,
    outputTokens: input.usage?.outputTokens ?? null,
    totalTokens: input.usage?.totalTokens ?? null,
    costUsd: input.usage?.costUsd ?? null,
    latencyMs: input.latencyMs,
    skillsRead: input.skillsRead,
    ok: input.ok,
    errorKind: input.errorKind,
  };
}

export function getAgentDir(name: AgentName): string {
  const libDir = fileURLToPath(new URL(".", import.meta.url));
  return join(libDir, "../../agents/defs", name);
}

function resolveModel(manifestPreferred: string): string {
  return env.OPENAI_MODEL ?? manifestPreferred;
}

interface CollectOptions {
  allowToolStream: boolean;
}

interface CollectResult {
  content: string;
  skillsRead: string[];
  usage?: GCAssistantMessage["usage"];
}

async function collectAssistantContent(
  stream: Query,
  options: CollectOptions,
): Promise<CollectResult> {
  let lastAssistant: GCAssistantMessage | null = null;
  const skillsRead: string[] = [];

  for await (const message of stream) {
    if (message.type === "tool_use") {
      if (!options.allowToolStream) {
        throw new Error("Agent attempted tool use.");
      }

      const readPath = extractReadPath(message);
      if (readPath !== null) {
        skillsRead.push(readPath);
        if (env.NODE_ENV === "development") {
          console.info("gitagent read:", readPath);
        }
      }
    }

    if (message.type === "system" && message.subtype === "error") {
      throw new Error(message.content || "Agent system error.");
    }

    if (message.type === "assistant") {
      lastAssistant = message;

      if (message.stopReason === "error") {
        throw new Error(message.errorMessage ?? "Agent returned an error.");
      }

      if (message.stopReason === "aborted") {
        throw new Error("Agent call aborted.");
      }

      if (message.stopReason === "toolUse" && !options.allowToolStream) {
        throw new Error("Agent attempted tool use.");
      }
    }
  }

  if (!lastAssistant || lastAssistant.stopReason !== "stop") {
    throw new Error("Agent returned no assistant message.");
  }

  return {
    content: lastAssistant.content,
    skillsRead,
    usage: lastAssistant.usage,
  };
}

function resolveTools(
  agentDir: string,
  allowReadTool: boolean,
): GCToolDefinition[] {
  if (!allowReadTool) {
    return [];
  }

  return [createReadTool(agentDir)];
}

function resolveDump(options: RunAgentOptions): boolean {
  if (options.skillLoad === "dump") {
    return true;
  }
  if (options.skillLoad === "catalog") {
    return false;
  }
  return env.PREFLIGHT_SKILL_DUMP === "1";
}

export async function runAgent(
  name: AgentName,
  prompt: string,
  options: RunAgentOptions = {},
): Promise<RunAgentResult> {
  const startedAt = Date.now();
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const agentDir = getAgentDir(name);
  const runtime = await readAgentRuntimeConfig(agentDir);
  const model = resolveModel(runtime.modelPreferred);
  const policy = getAgentToolPolicy(name);
  const skillSuffix = policy.allowReadTool
    ? await buildAgentSkillSuffix(agentDir, options.skillNames, resolveDump(options))
    : "";
  const basePrompt = await buildAgentSystemPrompt(agentDir);
  const systemPrompt =
    skillSuffix.length > 0 ? `${basePrompt}\n\n${skillSuffix}` : basePrompt;

  process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;

  const stream = query({
    dir: agentDir,
    prompt,
    model,
    systemPrompt,
    tools: resolveTools(agentDir, policy.allowReadTool),
    replaceBuiltinTools: true,
    maxTurns: runtime.maxTurns,
    abortController: new AbortController(),
  });

  let timer: ReturnType<typeof setTimeout> | undefined;
  let skillsRead: string[] = [];
  let partialOutput = "";

  try {
    const collected = await Promise.race([
      collectAssistantContent(stream, {
        allowToolStream: policy.allowToolStream,
      }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          stream.abort();
          void stream.return(undefined);
          reject(new Error("Agent call timed out."));
        }, timeoutMs);
      }),
    ]);

    skillsRead = collected.skillsRead;
    partialOutput = collected.content;

    const meta = buildAgentRunMeta({
      agentName: name,
      agentDefVersion: runtime.version,
      model,
      prompt,
      output: collected.content,
      latencyMs: Date.now() - startedAt,
      skillsRead: collected.skillsRead,
      usage: collected.usage,
      ok: true,
      errorKind: null,
    });

    return {
      content: collected.content,
      skillsRead: collected.skillsRead,
      usage: collected.usage,
      meta,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Agent call failed.";
    const meta = buildAgentRunMeta({
      agentName: name,
      agentDefVersion: runtime.version,
      model,
      prompt,
      output: partialOutput,
      latencyMs: Date.now() - startedAt,
      skillsRead,
      ok: false,
      errorKind: message,
    });
    throw new AgentInvocationError(message, meta);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
