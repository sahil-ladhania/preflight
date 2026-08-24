/**
 * workbench — Screen 5 chat fixtures.
 * Why: POST /workbench/chat stub without wiring.
 */

import type { WorkbenchChatResponse } from "@preflight/schemas";

export const WORKBENCH_EMPTY_PROMPT =
  "Ask about a rule, applicability, or what Preflight checks.";

export const WORKBENCH_STUB_SUCCESS: WorkbenchChatResponse = {
  message:
    "SEBI-06 covers performance claims that imply guaranteed returns. Judgement rules like this one need human review when the copy suggests certainty. BRAND-03 catches overstated differentiation in claims.",
  ruleIds: ["SEBI-06", "BRAND-03"],
};

export const WORKBENCH_STUB_SUCCESS_ALT: WorkbenchChatResponse = {
  message:
    "Deterministic rules such as SEBI-01 require the standard risk disclaimer in asset copy. They run on every generate and block shipping when they fail unwaived.",
  ruleIds: ["SEBI-01", "SEBI-02"],
};

export function resolveWorkbenchChat(
  message: string,
  turnIndex: number,
): { ok: true; data: WorkbenchChatResponse } | { ok: false; error: string } {
  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: "Message cannot be empty." };
  }
  if (trimmed.toLowerCase().includes("fail")) {
    return {
      ok: false,
      error: "Explainer unavailable — try search below.",
    };
  }
  const data =
    turnIndex % 2 === 0 ? WORKBENCH_STUB_SUCCESS : WORKBENCH_STUB_SUCCESS_ALT;
  return { ok: true, data };
}
