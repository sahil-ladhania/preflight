/**
 * rerun-lib.test — operator summaries for rerun strip.
 */

import { describe, expect, it } from "vitest";

import type { RerunStripDTO } from "@preflight/schemas";

import {
  driftChangeLabel,
  driftKindLabel,
  formatRuleIdDisplay,
  isCatalogRuleId,
  rerunDriftSummary,
  rerunEngineVerdict,
  rulesetMatchesLive,
} from "@/features/assets/rerun-lib";

const baseStrip: RerunStripDTO = {
  runHash: "a".repeat(64),
  rerunHash: "a".repeat(64),
  hashesMatch: true,
  rulesetHash: "b".repeat(64),
  liveRulesetHash: "b".repeat(64),
  driftItems: [],
};

describe("rerunEngineVerdict", () => {
  it("describes a matching engine run", () => {
    expect(rerunEngineVerdict(baseStrip)).toContain("unchanged");
  });

  it("describes an engine mismatch", () => {
    expect(
      rerunEngineVerdict({ ...baseStrip, hashesMatch: false, rerunHash: "c".repeat(64) }),
    ).toContain("Engine mismatch");
  });
});

describe("rerunDriftSummary", () => {
  it("reports unchanged rulebook", () => {
    expect(rerunDriftSummary(baseStrip)).toContain("unchanged");
  });

  it("reports drift count when ruleset differs", () => {
    const strip: RerunStripDTO = {
      ...baseStrip,
      liveRulesetHash: "c".repeat(64),
      driftItems: [
        {
          kind: "rules_added_outside_freeze",
          ruleId: "SEBI-06",
          liveWording: "New rule wording.",
        },
      ],
    };
    expect(rerunDriftSummary(strip)).toContain("1 catalog change");
    expect(rulesetMatchesLive(strip)).toBe(false);
  });
});

describe("drift labels", () => {
  it("maps drift kinds and changes", () => {
    expect(driftKindLabel("rules_added_outside_freeze")).toContain("not in this run");
    expect(driftChangeLabel("wording")).toBe("Wording updated");
  });
});

describe("formatRuleIdDisplay", () => {
  it("keeps catalog ids and truncates uuid ids", () => {
    expect(formatRuleIdDisplay("SEBI-04")).toBe("SEBI-04");
    expect(formatRuleIdDisplay("44444444-4444-4444-4444-444444444402")).toBe(
      "44444444",
    );
    expect(isCatalogRuleId("SEBI-04")).toBe(true);
    expect(isCatalogRuleId("44444444-4444-4444-4444-444444444402")).toBe(false);
  });
});
