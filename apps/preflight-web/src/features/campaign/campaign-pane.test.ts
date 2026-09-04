/**
 * campaign-pane.test — Screen 3 pane selection and copy helpers.
 */

import { describe, expect, it } from "vitest";

import type { AssetListItemDTO, StructuredBriefInput } from "@preflight/schemas";

import {
  activeCampaignPane,
  buildPhaseLine,
  campaignEndLine,
  campaignProgressLine,
  countNeedsHuman,
  fieldReviewRows,
  formatBriefSummary,
} from "@/features/campaign/campaign-pane";

function validBrief(): StructuredBriefInput {
  return {
    objective: "Drive awareness",
    schemeName: "Bluepeak Flexi Cap Fund",
    schemeCategory: "Flexi Cap",
    audience: "Retail investors",
    channels: ["email", "linkedin"],
    market: "India",
    performanceFigures: [{ value: "18.2%", period: "3-year CAGR" }],
    claims: ["Flexibility"],
  };
}

function asset(status: AssetListItemDTO["status"]): AssetListItemDTO {
  return {
    id: "a1",
    campaignId: "c1",
    campaignName: "Bluepeak Flexi Cap Fund",
    channel: "email",
    headline: "Test",
    status,
    generationIndex: 1,
    regeneratedFromId: null,
    generatedAt: "2026-03-15T10:00:00.000Z",
    pendingCount: 0,
    statusDetail: "detail",
  };
}

describe("activeCampaignPane", () => {
  it("returns building while the chain runs", () => {
    expect(
      activeCampaignPane({
        hasAssets: false,
        buildInFlight: true,
        buildPhase: "compile",
        paneOverride: null,
        railView: "campaign-brief",
      }),
    ).toBe("building");
  });

  it("returns built on return visit when assets exist", () => {
    expect(
      activeCampaignPane({
        hasAssets: true,
        buildInFlight: false,
        buildPhase: "idle",
        paneOverride: null,
        railView: "campaign-generate",
      }),
    ).toBe("built");
  });

  it("returns freeze when view override is set", () => {
    expect(
      activeCampaignPane({
        hasAssets: true,
        buildInFlight: false,
        buildPhase: "idle",
        paneOverride: "freeze",
        railView: "campaign-generate",
      }),
    ).toBe("freeze");
  });

  it("returns brief when editing from built summary", () => {
    expect(
      activeCampaignPane({
        hasAssets: true,
        buildInFlight: false,
        buildPhase: "idle",
        paneOverride: "brief-edit",
        railView: "campaign-generate",
      }),
    ).toBe("brief");
  });
});

describe("buildPhaseLine", () => {
  it("shows starting copy before the first phase is set", () => {
    expect(buildPhaseLine("idle", true)).toBe("Starting build…");
  });

  it("shows compile copy while compile runs", () => {
    expect(buildPhaseLine("compile", true)).toBe(
      "Freezing the rules that apply to this brief…",
    );
  });
});

describe("formatBriefSummary", () => {
  it("joins populated brief fields with middle dots", () => {
    expect(formatBriefSummary(validBrief())).toContain("Drive awareness");
    expect(formatBriefSummary(validBrief())).toContain("Bluepeak Flexi Cap Fund");
  });
});

describe("fieldReviewRows", () => {
  it("returns eight label-value rows", () => {
    expect(fieldReviewRows(validBrief())).toHaveLength(8);
    expect(fieldReviewRows(validBrief())[0]?.label).toBe("Objective");
  });
});

describe("campaignProgressLine", () => {
  it("counts assets still needing a human", () => {
    const line = campaignProgressLine([
      asset("clear"),
      asset("blocked"),
      asset("needs_human"),
    ]);
    expect(line).toBe("2 of 3 still need a human decision.");
  });

  it("reports all ready when none need a human", () => {
    expect(campaignProgressLine([asset("clear"), asset("cleared_with_exception")])).toBe(
      "All 2 ready to ship.",
    );
  });

  it("appends the judgement fan-out count while findings are pending", () => {
    expect(
      campaignProgressLine([
        { ...asset("clear"), pendingCount: 2 },
        { ...asset("blocked"), pendingCount: 1 },
      ]),
    ).toBe("1 of 2 still need a human decision. Evaluating 3 rules…");
  });
});

describe("campaignEndLine", () => {
  it("restates asset count and human queue", () => {
    expect(
      campaignEndLine([asset("clear"), asset("blocked")]),
    ).toContain("2 assets · 1 still need a human");
  });
});

describe("countNeedsHuman", () => {
  it("includes blocked, needs_human, and needs_regen", () => {
    expect(
      countNeedsHuman([
        asset("blocked"),
        asset("needs_regen"),
        asset("clear"),
      ]),
    ).toBe(2);
  });
});
