/**
 * journey.test — Workbench freeze/generate captions and extract summary.
 * Why: reuse campaign gates; honest no skill read caption.
 */

import { describe, expect, it } from "vitest";

import type { StructuredBriefInput } from "@preflight/schemas";

import {
  freezeDisabledCaption,
  proposalSummaryLines,
  skillsReadCaption,
} from "@/features/workbench/journey";

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

describe("skillsReadCaption", () => {
  it("returns no skill read when the list is empty", () => {
    expect(skillsReadCaption([])).toBe("no skill read");
  });

  it("joins generator skill paths", () => {
    expect(
      skillsReadCaption([
        "skills/brand-voice/SKILL.md",
        "skills/channel-email/SKILL.md",
      ]),
    ).toBe("skills/brand-voice/SKILL.md · skills/channel-email/SKILL.md");
  });
});

describe("freezeDisabledCaption", () => {
  it("asks to save when the brief is not saved", () => {
    expect(
      freezeDisabledCaption({
        s2Dimmed: true,
        briefDirty: true,
        freezeInFlight: false,
      }),
    ).toBe("Save brief first.");
  });

  it("asks to save dirty brief before freeze", () => {
    expect(
      freezeDisabledCaption({
        s2Dimmed: false,
        briefDirty: true,
        freezeInFlight: false,
      }),
    ).toBe("Save brief before freezing.");
  });
});

describe("proposalSummaryLines", () => {
  it("includes dashed field labels from a complete proposal", () => {
    const lines = proposalSummaryLines(completeBrief);
    expect(lines.some((line) => line.label === "Scheme name")).toBe(true);
    expect(lines.some((line) => line.value.includes("email"))).toBe(true);
  });
});
