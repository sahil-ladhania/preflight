/**
 * lib.test — workbench handoff gating and extract helpers.
 * Why: CTA when brief complete; extract seeds from explainer.
 */

import { describe, expect, it } from "vitest";

import type { StructuredBriefInput } from "@preflight/schemas";

import {
  buildHandoffFreeText,
  handoffBriefFromMessages,
  handoffEnabled,
  promptGroupsForPersona,
  seedProposalFromExplainer,
  toChatHistory,
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

describe("promptGroupsForPersona", () => {
  it("puts the campaign group first for Meera", () => {
    expect(promptGroupsForPersona("meera").map((group) => group.label)).toEqual([
      "START A CAMPAIGN",
      "ASK ABOUT THE RULES",
    ]);
  });

  it("puts the rules group first for Arjun", () => {
    expect(promptGroupsForPersona("arjun").map((group) => group.label)).toEqual([
      "ASK ABOUT THE RULES",
      "START A CAMPAIGN",
    ]);
  });
});

describe("handoffEnabled", () => {
  it("is false for campaign intent alone without a complete brief", () => {
    const messages: WorkbenchMessage[] = [
      { id: "user-1", role: "user", text: "Bluepeak campaign for LinkedIn" },
    ];
    expect(handoffEnabled(messages)).toBe(false);
  });

  it("is false for pure rule questions without a complete brief", () => {
    const messages: WorkbenchMessage[] = [
      { id: "user-1", role: "user", text: "What is det vs judgement?" },
    ];
    expect(handoffEnabled(messages)).toBe(false);
  });

  it("is false when handoff is suggested but brief is incomplete", () => {
    const messages: WorkbenchMessage[] = [
      { id: "user-1", role: "user", text: "Campaign for Bluepeak" },
      assistantMessage({
        suggestedAction: "handoff_campaign",
        brief: { schemeName: "Bluepeak Flexi Cap Fund" },
      }),
    ];
    expect(handoffEnabled(messages)).toBe(false);
  });

  it("is true when accumulated brief is complete", () => {
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
});

describe("toChatHistory", () => {
  it("omits pending and error cards from explainer history", () => {
    const messages: WorkbenchMessage[] = [
      { id: "user-1", role: "user", text: "First turn" },
      assistantMessage({ text: "Reply" }),
      { id: "pending-1", role: "pending" },
      { id: "error-1", role: "error", text: "Explainer unavailable" },
    ];
    expect(toChatHistory(messages)).toEqual([
      { role: "user", content: "First turn" },
      { role: "assistant", content: "Reply" },
    ]);
  });
});

describe("buildHandoffFreeText", () => {
  it("joins user turns with blank lines", () => {
    const messages: WorkbenchMessage[] = [
      { id: "user-1", role: "user", text: "First turn" },
      assistantMessage({ text: "Reply" }),
      { id: "user-2", role: "user", text: "Second turn" },
    ];
    expect(buildHandoffFreeText(messages)).toBe("First turn\n\nSecond turn");
  });
});

describe("seedProposalFromExplainer", () => {
  it("prefers extract keys over explainer brief", () => {
    const extracted = { objective: "From extract", market: "India" };
    const merged = seedProposalFromExplainer(extracted, completeBrief);
    expect(merged.objective).toBe("From extract");
    expect(merged.schemeName).toBe(completeBrief.schemeName);
    expect(merged.market).toBe("India");
  });

  it("returns extract only when explainer brief is absent", () => {
    const extracted = { objective: "From extract" };
    expect(seedProposalFromExplainer(extracted, null)).toEqual(extracted);
  });
});
