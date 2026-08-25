/**
 * applies-spec.test — appliesSpec interpreter tests.
 * Why: judgement predicate JSON contract (12 Area 1).
 */
import { describe, expect, it } from "vitest";

import { appliesSpec } from "./applies-spec.js";
import type { StructuredBrief } from "./structured-brief.js";

const sampleBrief: StructuredBrief = {
  objective: "Grow AUM",
  schemeName: "Bluepeak Flexi Cap Fund",
  schemeCategory: "Flexi Cap",
  audience: "Retail investors",
  channels: ["email", "linkedin"],
  market: "India",
  performanceFigures: [{ value: "18.2%", period: "3-year CAGR" }],
  claims: ["Market-leading flexibility", "differentiation"],
};

describe("appliesSpec", () => {
  it("evaluates channels in", () => {
    expect(
      appliesSpec(sampleBrief, {
        field: "channels",
        op: "in",
        value: ["linkedin", "email"],
      }),
    ).toBe(true);
  });

  it("evaluates claims in", () => {
    expect(
      appliesSpec(sampleBrief, {
        field: "claims",
        op: "in",
        value: ["differentiation", "market-leading"],
      }),
    ).toBe(true);
  });

  it("returns false for performanceFigures field", () => {
    expect(
      appliesSpec(sampleBrief, {
        field: "performanceFigures",
        op: "equals",
        value: "18.2%",
      }),
    ).toBe(false);
  });

  it("returns false for invalid channel equals value", () => {
    expect(
      appliesSpec(sampleBrief, {
        field: "channels",
        op: "equals",
        value: "digital",
      }),
    ).toBe(false);
  });
});
