/**
 * predicates.test — applies(brief) for package det rules.
 * Why: compile predicate contract (12 Area 1).
 */
import { describe, expect, it } from "vitest";

import {
  appliesSebi01,
  appliesSebi03,
  appliesSebi04,
  appliesSebi05,
} from "./predicates.js";
import type { StructuredBrief } from "./structured-brief.js";

const sampleBrief: StructuredBrief = {
  objective: "Grow AUM",
  schemeName: "Bluepeak Flexi Cap Fund",
  schemeCategory: "Flexi Cap",
  audience: "Retail investors",
  channels: ["email", "display"],
  market: "India",
  performanceFigures: [{ value: "18.2%", period: "3-year CAGR" }],
  claims: ["Market-leading flexibility"],
};

describe("det predicates", () => {
  it("appliesSebi01 when channels are present", () => {
    expect(appliesSebi01(sampleBrief)).toBe(true);
    expect(
      appliesSebi01({ ...sampleBrief, channels: [] as StructuredBrief["channels"] }),
    ).toBe(false);
  });

  it("appliesSebi03 when performance figures exist", () => {
    expect(appliesSebi03(sampleBrief)).toBe(true);
    expect(appliesSebi03({ ...sampleBrief, performanceFigures: [] })).toBe(false);
  });

  it("appliesSebi04 always true", () => {
    expect(appliesSebi04(sampleBrief)).toBe(true);
  });

  it("appliesSebi05 when performance figures exist", () => {
    expect(appliesSebi05(sampleBrief)).toBe(true);
    expect(appliesSebi05({ ...sampleBrief, performanceFigures: [] })).toBe(false);
  });
});
