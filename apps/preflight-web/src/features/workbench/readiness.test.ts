/**
 * readiness.test — handoff readiness from accumulated drafts.
 */

import { describe, expect, it } from "vitest";

import type { StructuredBriefInput } from "@preflight/schemas";

import {
  accumulatedBriefFromMessages,
  deriveBriefReadiness,
  handoffReadyState,
} from "@/features/workbench/useBriefReadiness";
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

describe("accumulatedBriefFromMessages", () => {
  it("merges draft briefs across assistant turns", () => {
    const messages: WorkbenchMessage[] = [
      { id: "u1", role: "user", text: "Campaign for Bluepeak Flexi Cap Fund" },
      {
        id: "a1",
        role: "assistant",
        text: "Got scheme name.",
        ruleIds: [],
        brief: { schemeName: "Bluepeak Flexi Cap Fund", channels: ["email"] },
      },
      {
        id: "a2",
        role: "assistant",
        text: "Got market.",
        ruleIds: [],
        brief: { market: "India", audience: "HNI investors in India" },
      },
    ];
    const captured = accumulatedBriefFromMessages(messages);
    expect(captured.schemeName).toBe("Bluepeak Flexi Cap Fund");
    expect(captured.market).toBe("India");
    expect(captured.channels).toEqual(["email"]);
  });
});

describe("handoffReadyState", () => {
  it("blocks handoff when brief is incomplete", () => {
    const messages: WorkbenchMessage[] = [
      { id: "u1", role: "user", text: "LinkedIn campaign for Bluepeak" },
      {
        id: "a1",
        role: "assistant",
        text: "Need scheme category.",
        ruleIds: [],
        brief: { schemeName: "Bluepeak Flexi Cap Fund" },
      },
    ];
    const state = handoffReadyState(messages);
    expect(state.canStart).toBe(false);
    expect(state.disabledCaption).toContain("still needed");
  });

  it("allows handoff when accumulated brief is complete", () => {
    const messages: WorkbenchMessage[] = [
      { id: "u1", role: "user", text: "Full campaign brief" },
      {
        id: "a1",
        role: "assistant",
        text: "Ready.",
        ruleIds: [],
        suggestedAction: "handoff_campaign",
        brief: completeBrief,
      },
    ];
    expect(handoffReadyState(messages).canStart).toBe(true);
    expect(deriveBriefReadiness(messages).complete).toBe(true);
  });
});
