/**
 * generate-agent — live generator agent call + parse.
 * Why: keep generate.service orchestration under size limit.
 */
import { buildGeneratorHintLines } from "@preflight/rules";
import {
  GeneratorOutputSchema,
  type Channel,
  type GeneratorOutput,
  type RuleKind,
  type StructuredBriefInput,
} from "@preflight/schemas";

import {
  buildGeneratorPrompt,
  type RegenRevisionInput,
} from "../../../agents/generator.prompt.js";
import {
  AgentInvocationError,
  hashAgentText,
  type AgentRunMeta,
} from "../../lib/gitagent.js";
import { InternalError } from "../../lib/http-error.js";
import {
  resolveGeneratorSkillNames,
  skillFilePath,
} from "../../lib/agent-skills.js";
import { loadBrandKit } from "../../lib/brand-kit.js";
import { recordAgentRun } from "../agent-runs/agent-runs.service.js";

function stripJsonFence(content: string): string {
  const trimmed = content.trim();
  const match = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  return match?.[1]?.trim() ?? trimmed;
}

export interface CallGeneratorInput {
  channel: Channel;
  brief: StructuredBriefInput;
  rules: Array<{ ruleId: string; kind: RuleKind; wording: string }>;
  pinnedDetRuleIds: string[];
  revisionContext?: RegenRevisionInput;
}

export interface CallGeneratorResult {
  output: GeneratorOutput;
  skillsRead: string[];
  meta: AgentRunMeta;
}

export function unionSkillsRead(groups: string[][]): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const group of groups) {
    for (const path of group) {
      if (!seen.has(path)) {
        seen.add(path);
        merged.push(path);
      }
    }
  }

  return merged;
}

async function recordGeneratorFailure(meta: AgentRunMeta): Promise<void> {
  await recordAgentRun(meta, { kind: "asset", id: null });
}

export async function callGenerator(
  input: CallGeneratorInput,
): Promise<CallGeneratorResult> {
  try {
    const detHintLines = buildGeneratorHintLines(input.pinnedDetRuleIds, {
      schemeName: input.brief.schemeName,
      performanceFigures: input.brief.performanceFigures,
    });
    const inScope = resolveGeneratorSkillNames(input.channel);
    const prompt = buildGeneratorPrompt({
      channel: input.channel,
      brief: input.brief,
      brandKit: loadBrandKit(),
      rules: input.rules,
      detHintLines,
      revisionContext: input.revisionContext,
      inScopeSkillPaths: inScope.map(skillFilePath),
    });
    const { runAgent } = await import("../../lib/gitagent.js");
    const { content, skillsRead, meta } = await runAgent("generator", prompt, {
      skillNames: inScope,
    });

    try {
      const parsed: unknown = JSON.parse(stripJsonFence(content));
      return {
        output: GeneratorOutputSchema.parse(parsed),
        skillsRead,
        meta,
      };
    } catch {
      await recordGeneratorFailure({
        ...meta,
        ok: false,
        errorKind: "parse_failed",
        output: content,
        outputHash: hashAgentText(content),
      });
      throw new InternalError("Generate failed.");
    }
  } catch (error) {
    if (error instanceof AgentInvocationError) {
      await recordGeneratorFailure(error.meta);
      throw new InternalError("Generate failed.");
    }

    if (error instanceof InternalError) {
      throw error;
    }

    throw new InternalError("Generate failed.");
  }
}
