/**
 * brief-rail-lib — when the Campaign Brief rail should appear.
 * Why: conversation-driven signal only; persona is not used.
 */

import type { WorkbenchMessage } from "@/features/workbench/types";

export function isBriefRailEligible(
  messages: WorkbenchMessage[],
  capturedCount: number,
): boolean {
  if (capturedCount >= 1) {
    return true;
  }
  return messages.some(
    (message) =>
      message.role === "assistant" &&
      message.suggestedAction === "handoff_campaign",
  );
}
