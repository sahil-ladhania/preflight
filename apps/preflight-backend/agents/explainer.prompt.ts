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
    "When the operator describes a campaign, interview them: gather every StructuredBrief field from the full conversation before handoff.",
    "Ask one missing required field at a time. Accept 'none' for performance figures and claims (use empty arrays).",
    "Set suggestedAction to handoff_campaign only when you include a complete brief object in JSON.",
    "Omit the brief key entirely until handoff — do not emit partial brief objects during the interview.",
    "",
    ...formatHistory(input.history ?? []),
    "Question:",
    input.message,
    "",
    "Rule catalog:",
    ...catalogLines,
    "",
    'Respond JSON only: {"message":"...","ruleIds":[],"suggestedAction":"handoff_campaign"|"none","brief":{...}}',
    "Include brief only on the handoff turn when every required field is known.",
  ].join("\n");
}
