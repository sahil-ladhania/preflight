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
import { InternalError } from "../../lib/http-error.js";
import { loadBrandKit } from "../../lib/brand-kit.js";

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

export async function callGenerator(
  input: CallGeneratorInput,
): Promise<GeneratorOutput> {
  try {
    const detHintLines = buildGeneratorHintLines(input.pinnedDetRuleIds, {
      schemeName: input.brief.schemeName,
      performanceFigures: input.brief.performanceFigures,
    });
    const prompt = buildGeneratorPrompt({
      channel: input.channel,
      brief: input.brief,
      brandKit: loadBrandKit(),
      rules: input.rules,
      detHintLines,
      revisionContext: input.revisionContext,
    });
    const { runAgent } = await import("../../lib/gitagent.js");
    const { content } = await runAgent("generator", prompt);
    const parsed: unknown = JSON.parse(stripJsonFence(content));
    return GeneratorOutputSchema.parse(parsed);
  } catch {
    throw new InternalError("Generate failed.");
  }
}
