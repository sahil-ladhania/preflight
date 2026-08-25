/**
 * lib.test — brief normalize, validation, and save gate captions.
 * Why: Save brief must enable when form is complete after normalize.
 */

import { describe, expect, it } from "vitest";

import type { StructuredBriefInput } from "@preflight/schemas";

import {
  briefIsValid,
  campaignGateState,
  emptyBrief,
  normalizeBrief,
  saveDisabledCaption,
} from "@/features/campaign/lib";

function validBrief(
  overrides: Partial<StructuredBriefInput> = {},
): StructuredBriefInput {
  return {
    objective: "Launch a professional LinkedIn and email campaign",
    schemeName: "Bluepeak Flexi Cap Fund",
    schemeCategory: "Flexi Cap",
    audience: "HNI investors in India",
    channels: ["email", "linkedin"],
    market: "India",
    performanceFigures: [{ value: "18.2%", period: "3-year CAGR" }],
    claims: ["Highlight flexibility across market caps"],
    ...overrides,
  };
}

describe("normalizeBrief", () => {
  it("drops fully empty performance figure rows", () => {
    const brief = validBrief({
      performanceFigures: [
        { value: "18.2%", period: "3-year CAGR" },
        { value: "", period: "" },
      ],
    });

    expect(normalizeBrief(brief).performanceFigures).toEqual([
      { value: "18.2%", period: "3-year CAGR" },
    ]);
  });

  it("keeps partial performance figure rows", () => {
    const brief = validBrief({
      performanceFigures: [{ value: "18.2%", period: "" }],
    });

    expect(normalizeBrief(brief).performanceFigures).toEqual([
      { value: "18.2%", period: "" },
    ]);
  });

  it("drops empty claim strings", () => {
    const brief = validBrief({
      claims: ["Highlight flexibility across market caps", ""],
    });

    expect(normalizeBrief(brief).claims).toEqual([
      "Highlight flexibility across market caps",
    ]);
  });
});

describe("briefIsValid", () => {
  it("accepts a complete brief", () => {
    expect(briefIsValid(validBrief())).toBe(true);
  });

  it("rejects empty required scalar fields", () => {
    expect(briefIsValid(validBrief({ schemeCategory: "" }))).toBe(false);
  });

  it("accepts brief with trailing empty claim after normalize", () => {
    expect(
      briefIsValid(validBrief({ claims: ["Highlight flexibility", ""] })),
    ).toBe(true);
  });

  it("accepts brief with trailing empty figure row after normalize", () => {
    expect(
      briefIsValid(
        validBrief({
          performanceFigures: [
            { value: "18.2%", period: "3-year CAGR" },
            { value: "", period: "" },
          ],
        }),
      ),
    ).toBe(true);
  });
});

describe("campaignGateState", () => {
  it("enables save for a valid unsaved brief", () => {
    const brief = validBrief();
    const gate = campaignGateState({
      brief,
      savedBrief: emptyBrief(),
      briefSaved: false,
      compileResult: null,
      emptySetAcknowledged: false,
      generateInFlight: false,
    });

    expect(gate.saveDisabled).toBe(false);
    expect(gate.saveDisabledCaption).toBeNull();
  });

  it("disables save with caption when required fields are missing", () => {
    const brief = validBrief({ market: "" });
    const gate = campaignGateState({
      brief,
      savedBrief: emptyBrief(),
      briefSaved: false,
      compileResult: null,
      emptySetAcknowledged: false,
      generateInFlight: false,
    });

    expect(gate.saveDisabled).toBe(true);
    expect(gate.saveDisabledCaption).toBe(
      "Complete required fields before saving.",
    );
  });

  it("disables save when brief is saved and unchanged", () => {
    const brief = validBrief();
    const gate = campaignGateState({
      brief,
      savedBrief: brief,
      briefSaved: true,
      compileResult: null,
      emptySetAcknowledged: false,
      generateInFlight: false,
    });

    expect(gate.saveDisabled).toBe(true);
    expect(gate.saveDisabledCaption).toBe("No changes to save.");
  });
});

describe("saveDisabledCaption", () => {
  it("returns null when save is enabled", () => {
    expect(
      saveDisabledCaption({
        saveDisabled: false,
        briefDirty: true,
        briefSaved: false,
      }),
    ).toBeNull();
  });
});
