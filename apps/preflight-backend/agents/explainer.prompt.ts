/**
 * explainer.prompt — per-call explainer prompt builder.
 * Why: question + live catalog lines (13-agent-architecture.md).
 */
import type { RuleKind, WorkbenchChatHistoryItem } from "@preflight/schemas";

export interface ExplainerPromptInput {
  message: string;
  history?: WorkbenchChatHistoryItem[];
  catalogLines: Array<{ ruleId: string; kind: RuleKind; wording: string }>;
}

function formatHistory(history: WorkbenchChatHistoryItem[]): string[] {
  if (history.length === 0) {
    return [];
  }

  return [
    "Prior conversation:",
    ...history.map((turn) => `${turn.role}: ${turn.content}`),
    "",
  ];
}

export function buildExplainerPrompt(input: ExplainerPromptInput): string {
  const catalogLines = input.catalogLines.map(
    (line) => `- [${line.kind}] ${line.ruleId}: ${line.wording}`,
  );

  return [
    "Answer the operator question using the rule catalog below. Read-only context only.",
    "You may discuss campaign intent and suggest handoff_campaign when appropriate.",
    "",
    ...formatHistory(input.history ?? []),
    "Question:",
    input.message,
    "",
    "Rule catalog:",
    ...catalogLines,
    "",
    'Respond JSON only: {"message":"...","ruleIds":[],"suggestedAction":"handoff_campaign"|"none"}',
  ].join("\n");
}
