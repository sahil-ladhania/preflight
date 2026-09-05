/**
 * brief-rail-lib.test — brief rail visibility predicate.
 */

import { describe, expect, it } from "vitest";

import { isBriefRailEligible } from "@/features/workbench/brief-rail-lib";
import type { WorkbenchMessage } from "@/features/workbench/types";

describe("isBriefRailEligible", () => {
  it("returns false for rules-only thread with no captured fields", () => {
    const messages: WorkbenchMessage[] = [
      { id: "u1", role: "user", text: "What does SEBI-06 check?" },
      {
        id: "a1",
        role: "assistant",
        text: "Performance claims.",
        ruleIds: ["SEBI-06"],
      },
    ];
    expect(isBriefRailEligible(messages, 0)).toBe(false);
  });

  it("returns true when at least one brief field is captured", () => {
    const messages: WorkbenchMessage[] = [
      { id: "u1", role: "user", text: "LinkedIn campaign for Bluepeak" },
      {
        id: "a1",
        role: "assistant",
        text: "Got scheme name.",
        ruleIds: [],
        brief: { schemeName: "Bluepeak Flexi Cap Fund" },
      },
    ];
    expect(isBriefRailEligible(messages, 1)).toBe(true);
  });

  it("returns true when assistant signals handoff_campaign", () => {
    const messages: WorkbenchMessage[] = [
      { id: "u1", role: "user", text: "Full campaign brief" },
      {
        id: "a1",
        role: "assistant",
        text: "Ready.",
        ruleIds: ["SEBI-02"],
        suggestedAction: "handoff_campaign",
      },
    ];
    expect(isBriefRailEligible(messages, 0)).toBe(true);
  });
});
