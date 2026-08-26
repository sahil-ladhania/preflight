/**
 * narration.test — build step voice strings stay agent-named and actionable.
 */

import { describe, expect, it } from "vitest";

import type { CompileResponseDTO, StructuredBriefInput } from "@preflight/schemas";

import {
  buildCompileNarration,
  buildExtractNarration,
  buildGenerateNarration,
  buildNeedsAckNarration,
  buildNeedsInputNarration,
  buildSaveNarration,
  missingBriefFields,
} from "@/features/campaign/narration";

const validBrief: StructuredBriefInput = {
  objective: "Launch awareness",
  schemeName: "Bluepeak Flexi Cap Fund",
  schemeCategory: "Flexi Cap",
  audience: "HNI investors",
  channels: ["email", "linkedin"],
  market: "India",
  performanceFigures: [{ value: "18.2%", period: "3-year CAGR" }],
  claims: ["Flexibility across market caps"],
};

describe("buildExtractNarration", () => {
  it("names GitAgent extractor and lists skills", () => {
    const text = buildExtractNarration(
      { objective: "Launch", channels: ["email"] },
      ["skills/brief-structure/SKILL.md"],
    );
    expect(text).toContain("GitAgent extractor");
    expect(text).toContain("brief-structure");
    expect(text).toContain("Build it");
  });
});

describe("buildSaveNarration", () => {
  it("summarizes channels and points to freeze", () => {
    const text = buildSaveNarration(validBrief);
    expect(text).toContain("Brief saved");
    expect(text).toContain("email, linkedin");
    expect(text).toContain("Freeze");
  });
});

describe("buildCompileNarration", () => {
  it("names server freeze and rule count", () => {
    const result: CompileResponseDTO = {
      constraintSetId: "cs-1",
      rulesetHash: "a".repeat(64),
      ruleIds: ["SEBI-01", "SEBI-02"],
      rules: [],
    };
    const text = buildCompileNarration(result);
    expect(text).toContain("Freeze ran in code");
    expect(text).toContain("2 rules frozen");
  });

  it("handles zero rules", () => {
    const result: CompileResponseDTO = {
      constraintSetId: "cs-1",
      rulesetHash: "a".repeat(64),
      ruleIds: [],
      rules: [],
    };
    const text = buildCompileNarration(result);
    expect(text).toContain("0 rules frozen");
    expect(text).toContain("empty set");
  });
});

describe("buildGenerateNarration", () => {
  it("names GitAgent generator and channels", () => {
    const text = buildGenerateNarration(
      2,
      ["email", "linkedin"],
      ["skills/brand-voice/SKILL.md"],
    );
    expect(text).toContain("GitAgent generator");
    expect(text).toContain("brand-voice");
    expect(text).toContain("ledger");
  });
});

describe("buildNeedsInputNarration", () => {
  it("lists missing field labels when extract ran", () => {
    const text = buildNeedsInputNarration(["objective", "channels"], {
      agentRan: true,
    });
    expect(text).toContain("Objective");
    expect(text).toContain("Channels");
    expect(text).toContain("Build it");
  });

  it("uses calm copy when extractor did not run", () => {
    const text = buildNeedsInputNarration(["objective"], { agentRan: false });
    expect(text).toContain("Add your campaign details");
    expect(text).not.toContain("GitAgent");
  });
});

describe("buildNeedsAckNarration", () => {
  it("prompts empty-set acknowledgement", () => {
    const text = buildNeedsAckNarration();
    expect(text).toContain("no compliance rules");
    expect(text).toContain("Acknowledge");
  });
});

describe("missingBriefFields", () => {
  it("returns empty when brief is complete", () => {
    expect(missingBriefFields(validBrief)).toEqual([]);
  });

  it("flags empty objective and channels", () => {
    expect(
      missingBriefFields({ ...validBrief, objective: "", channels: [] }),
    ).toEqual(expect.arrayContaining(["objective", "channels"]));
  });
});
