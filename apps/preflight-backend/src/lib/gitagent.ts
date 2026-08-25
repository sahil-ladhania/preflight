/**
 * gitagent — sole in-process query() gateway.
 * Why: locked defaults for all agents (13-agent-architecture.md §6, doc 19 §7.4).
 */
import { query } from "@open-gitagent/gitagent";
import type { GCAssistantMessage, GCToolDefinition, Query } from "@open-gitagent/gitagent";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { env } from "../config/env.js";
import { buildSkillPromptSuffix } from "./agent-skills.js";
import { getAgentToolPolicy } from "./agent-tool-policy.js";
import { createReadTool } from "./agent-tools.js";
import {
  buildAgentSystemPrompt,
  readAgentRuntimeConfig,
} from "./agent-dir.js";

export type AgentName = "extractor" | "generator" | "judge" | "explainer";

export interface RunAgentResult {
  content: string;
  usage?: GCAssistantMessage["usage"];
}

export interface RunAgentOptions {
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 60_000;

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

async function collectAssistantContent(
  stream: Query,
  options: CollectOptions,
): Promise<RunAgentResult> {
  let lastAssistant: GCAssistantMessage | null = null;

  for await (const message of stream) {
    if (message.type === "tool_use" && !options.allowToolStream) {
      throw new Error("Agent attempted tool use.");
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

export async function runAgent(
  name: AgentName,
  prompt: string,
  options: RunAgentOptions = {},
): Promise<RunAgentResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const agentDir = getAgentDir(name);
  const runtime = await readAgentRuntimeConfig(agentDir);
  const policy = getAgentToolPolicy(name);
  const skillSuffix = policy.allowReadTool
    ? await buildSkillPromptSuffix(agentDir)
    : "";
  const basePrompt = await buildAgentSystemPrompt(agentDir);
  const systemPrompt =
    skillSuffix.length > 0 ? `${basePrompt}\n\n${skillSuffix}` : basePrompt;

  process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;

  const stream = query({
    dir: agentDir,
    prompt,
    model: resolveModel(runtime.modelPreferred),
    systemPrompt,
    tools: resolveTools(agentDir, policy.allowReadTool),
    replaceBuiltinTools: true,
    maxTurns: runtime.maxTurns,
    abortController: new AbortController(),
  });

  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
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
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}
