/**
 * lib.test — workbench handoff gating and extract helpers.
 * Why: CTA when handoff suggested or campaign intent; extract seeds from explainer.
 */

import { describe, expect, it } from "vitest";

import type { StructuredBriefInput } from "@preflight/schemas";

import {
  buildHandoffFreeText,
  handoffBriefFromMessages,
  handoffEnabled,
  seedProposalFromExplainer,
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
  it("is true when a user turn has campaign intent", () => {
    const messages: WorkbenchMessage[] = [
      { id: "user-1", role: "user", text: "Bluepeak campaign for LinkedIn" },
    ];
    expect(handoffEnabled(messages)).toBe(true);
  });

  it("is false for pure rule questions without campaign intent", () => {
    const messages: WorkbenchMessage[] = [
      { id: "user-1", role: "user", text: "What is det vs judgement?" },
    ];
    expect(handoffEnabled(messages)).toBe(false);
  });

  it("is true when handoff is suggested without a brief", () => {
    const messages: WorkbenchMessage[] = [
      { id: "user-1", role: "user", text: "Campaign for Bluepeak" },
      assistantMessage({ suggestedAction: "handoff_campaign" }),
    ];
    expect(handoffEnabled(messages)).toBe(true);
  });

  it("still reads explainer brief when present on handoff turn", () => {
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
