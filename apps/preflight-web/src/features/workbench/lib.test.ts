/**
 * lib.test — workbench handoff gating on complete brief.
 * Why: CTA must not appear until Save-ready brief exists.
 */

import { describe, expect, it } from "vitest";

import type { StructuredBriefInput } from "@preflight/schemas";

import {
  handoffBriefFromMessages,
  handoffEnabled,
} from "@/features/workbench/lib";
import type { WorkbenchMessage } from "@/features/workbench/types";

const completeBrief: StructuredBriefInput = {
  objective: "Launch awareness for Bluepeak Flexi Cap.",
  schemeName: "Bluepeak Flexi Cap Fund",
  schemeCategory: "Flexi Cap",
  audience: "HNI investors in India",
  channels: ["email", "linkedin"],
  market: "India",
  performanceFigures: [{ value: "18.2%", period: "3-year CAGR" }],
  claims: ["Flexibility across market caps"],
};

function assistantMessage(
  overrides: Partial<Extract<WorkbenchMessage, { role: "assistant" }>> = {},
): Extract<WorkbenchMessage, { role: "assistant" }> {
  return {
    id: "assistant-1",
    role: "assistant",
    text: "Ready to start.",
    ruleIds: [],
    ...overrides,
  };
}

describe("handoffEnabled", () => {
  it("is false with only a user turn", () => {
    const messages: WorkbenchMessage[] = [
      { id: "user-1", role: "user", text: "Campaign for Bluepeak" },
    ];
    expect(handoffEnabled(messages)).toBe(false);
  });

  it("is false when handoff is suggested without a brief", () => {
    const messages: WorkbenchMessage[] = [
      { id: "user-1", role: "user", text: "Campaign for Bluepeak" },
      assistantMessage({ suggestedAction: "handoff_campaign" }),
    ];
    expect(handoffEnabled(messages)).toBe(false);
  });

  it("is true when the latest assistant turn has a complete brief", () => {
    const messages: WorkbenchMessage[] = [
      { id: "user-1", role: "user", text: "Campaign for Bluepeak" },
      assistantMessage({
        suggestedAction: "handoff_campaign",
        brief: completeBrief,
      }),
    ];
    expect(handoffEnabled(messages)).toBe(true);
    expect(handoffBriefFromMessages(messages)).toEqual(completeBrief);
  });

  it("is false when the latest assistant brief is incomplete", () => {
    const messages: WorkbenchMessage[] = [
      assistantMessage({
        suggestedAction: "handoff_campaign",
        brief: { ...completeBrief, market: "" },
      }),
    ];
    expect(handoffEnabled(messages)).toBe(false);
  });
});
