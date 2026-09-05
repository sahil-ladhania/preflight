/**
 * overview-copy.test — grammar at counts 0, 1, and many.
 * Why: plural bugs reached the surface across three screens; lock every phrase.
 */

import { describe, expect, it } from "vitest";

import {
  driftAssetNoun,
  driftCountLabel,
  needsYouSectionTitle,
  rulePressureCountLabel,
  stateLineCampaignsInProgress,
  stateLineNeedHuman,
  stateLineNeedHumanForPersona,
  stateLineShippedException,
} from "@/features/overview/overview-copy";

describe("stateLineNeedHuman", () => {
  it("is grammatical at 0, 1, and many", () => {
    expect(stateLineNeedHuman(0)).toBe("assets need a human");
    expect(stateLineNeedHuman(1)).toBe("asset needs a human");
    expect(stateLineNeedHuman(9)).toBe("assets need a human");
  });
});

describe("stateLineNeedHumanForPersona", () => {
  it("uses Arjun phrasing by default", () => {
    expect(stateLineNeedHumanForPersona(9, "arjun")).toBe("assets need a human");
    expect(stateLineNeedHumanForPersona(1, "arjun")).toBe("asset needs a human");
  });

  it("uses Meera phrasing when the campaign owner is signed in", () => {
    expect(stateLineNeedHumanForPersona(9, "meera")).toBe(
      "assets waiting on compliance",
    );
    expect(stateLineNeedHumanForPersona(1, "meera")).toBe(
      "asset waiting on compliance",
    );
  });
});

describe("needsYouSectionTitle", () => {
  it("forks the queue heading by persona", () => {
    expect(needsYouSectionTitle("arjun")).toBe("Needs you");
    expect(needsYouSectionTitle("meera")).toBe("Held for compliance");
  });
});

describe("stateLineShippedException", () => {
  it("is grammatical at 0, 1, and many", () => {
    expect(stateLineShippedException(0)).toBe("shipped with exceptions");
    expect(stateLineShippedException(1)).toBe("shipped with exception");
    expect(stateLineShippedException(4)).toBe("shipped with exceptions");
  });
});

describe("stateLineCampaignsInProgress", () => {
  it("is grammatical at 0, 1, and many", () => {
    expect(stateLineCampaignsInProgress(0)).toBe("campaigns in progress");
    expect(stateLineCampaignsInProgress(1)).toBe("campaign in progress");
    expect(stateLineCampaignsInProgress(2)).toBe("campaigns in progress");
  });

  it("does not duplicate campaign when composed with a count prefix", () => {
    const count = 2;
    expect(`${count} ${stateLineCampaignsInProgress(count)}`).toBe(
      "2 campaigns in progress",
    );
  });
});

describe("rulePressureCountLabel", () => {
  it("handles failed singular and plural", () => {
    expect(rulePressureCountLabel(1, 1, "failed")).toBe(
      "1 failure across 1 asset",
    );
    expect(rulePressureCountLabel(14, 11, "failed")).toBe(
      "14 failures across 11 assets",
    );
  });

  it("handles waived singular and plural", () => {
    expect(rulePressureCountLabel(1, 1, "waived")).toBe(
      "1 waiver across 1 asset",
    );
    expect(rulePressureCountLabel(2, 2, "waived")).toBe(
      "2 waivers across 2 assets",
    );
  });
});

describe("driftAssetNoun", () => {
  it("is grammatical at 0, 1, and many", () => {
    expect(driftAssetNoun(0)).toBe("assets");
    expect(driftAssetNoun(1)).toBe("asset");
    expect(driftAssetNoun(6)).toBe("assets");
  });
});

describe("driftCountLabel", () => {
  it("includes the numeric count at 0, 1, and many", () => {
    expect(driftCountLabel(0)).toBe("0 assets");
    expect(driftCountLabel(1)).toBe("1 asset");
    expect(driftCountLabel(6)).toBe("6 assets");
  });
});
