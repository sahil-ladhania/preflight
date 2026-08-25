/**
 * explainer.prompt — per-call explainer prompt builder.
 * Why: question + live catalog lines (13-agent-architecture.md).
 */
import type { RuleKind } from "@preflight/schemas";

export interface ExplainerPromptInput {
  message: string;
  catalogLines: Array<{ ruleId: string; kind: RuleKind; wording: string }>;
}

export function buildExplainerPrompt(input: ExplainerPromptInput): string {
  const catalogLines = input.catalogLines.map(
    (line) => `- [${line.kind}] ${line.ruleId}: ${line.wording}`,
  );

  return [
    "Answer the operator question using the rule catalog below. Read-only context only.",
    "",
    "Question:",
    input.message,
    "",
    "Rule catalog:",
    ...catalogLines,
  ].join("\n");
}
