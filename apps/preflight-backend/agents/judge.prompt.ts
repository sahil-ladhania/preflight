/**
 * judge.prompt — per-call judge prompt builder.
 * Why: snapshot wording + canonical text interpolation (13-agent-architecture.md).
 */

export interface JudgePromptInput {
  canonicalText: string;
  ruleWording: string;
  ruleId: string;
}

export function buildJudgePrompt(input: JudgePromptInput): string {
  return [
    `Evaluate rule ${input.ruleId} only. Ignore all other rules.`,
    "",
    "Rule wording:",
    input.ruleWording,
    "",
    "Asset copy (canonical text):",
    input.canonicalText,
    "",
    'Respond with JSON only: {"verdict":"pass"|"fail","reason":"...","spanText":"..."}',
    "Include spanText only when verdict is fail and a specific phrase from the copy violates the rule.",
    "spanText must be an exact substring of the asset copy.",
  ].join("\n");
}
