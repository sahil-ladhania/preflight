/**
 * generate-agent — live generator agent call + parse.
 * Why: keep generate.service orchestration under size limit.
 */
import {
  GeneratorOutputSchema,
  type Channel,
  type GeneratorOutput,
  type RuleKind,
  type StructuredBriefInput,
} from "@preflight/schemas";

import { buildGeneratorPrompt } from "../../../agents/generator.prompt.js";
import { InternalError } from "../../lib/http-error.js";

function stripJsonFence(content: string): string {
  const trimmed = content.trim();
  const match = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  return match?.[1]?.trim() ?? trimmed;
}

export async function callGenerator(
  channel: Channel,
  brief: StructuredBriefInput,
  rules: Array<{ ruleId: string; kind: RuleKind; wording: string }>,
): Promise<GeneratorOutput> {
  try {
    const prompt = buildGeneratorPrompt({ channel, brief, rules });
    const { runAgent } = await import("../../lib/gitagent.js");
    const { content } = await runAgent("generator", prompt);
    const parsed: unknown = JSON.parse(stripJsonFence(content));
    return GeneratorOutputSchema.parse(parsed);
  } catch {
    throw new InternalError("Generate failed.");
  }
}
