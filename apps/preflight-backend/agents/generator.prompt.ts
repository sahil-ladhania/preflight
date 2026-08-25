/**
 * generator.prompt — per-call generator prompt builder.
 * Why: brief + frozen snapshot wordings + channel (13-agent-architecture.md).
 */
import type { Channel, RuleKind, StructuredBriefInput } from "@preflight/schemas";

export interface GeneratorPromptInput {
  channel: Channel;
  brief: StructuredBriefInput;
  rules: Array<{ ruleId: string; kind: RuleKind; wording: string }>;
}

export function buildGeneratorPrompt(input: GeneratorPromptInput): string {
  const ruleLines = input.rules.map(
    (rule) => `- [${rule.kind}] ${rule.ruleId}: ${rule.wording}`,
  );

  return [
    `Write marketing copy for channel: ${input.channel}`,
    "",
    "Structured brief:",
    JSON.stringify(input.brief, null, 2),
    "",
    "Compliance rules (respect these wordings):",
    ...ruleLines,
  ].join("\n");
}
