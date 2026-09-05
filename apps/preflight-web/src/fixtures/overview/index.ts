/**
 * index — merged Overview fixture bundle.
 * Why: single import for the Overview screen; seed A–H plus extra rows.
 */

import { ASSETS_LIST_FIXTURE } from "@/fixtures/assets-list";
import { OVERVIEW_ASSETS_EXTRA } from "@/fixtures/overview/assets-extra";
import { OVERVIEW_CAMPAIGNS } from "@/fixtures/overview/campaigns";
import { OVERVIEW_EXCEPTIONS } from "@/fixtures/overview/exceptions";
import { OVERVIEW_PROOF_SPEED } from "@/fixtures/overview/proof-speed";
import { OVERVIEW_RULE_PRESSURE } from "@/fixtures/overview/rule-pressure";

import type { OverviewData } from "@/features/overview/types";

export const OVERVIEW_FIXTURE: OverviewData = {
  assets: [...ASSETS_LIST_FIXTURE, ...OVERVIEW_ASSETS_EXTRA],
  campaigns: OVERVIEW_CAMPAIGNS,
  exceptions: OVERVIEW_EXCEPTIONS,
  proofSpeed: OVERVIEW_PROOF_SPEED,
  rulePressure: OVERVIEW_RULE_PRESSURE,
};

/** Needs-you queue empty; exceptions and proof metrics unchanged. */
export const OVERVIEW_EMPTY_QUEUE_FIXTURE: OverviewData = {
  ...OVERVIEW_FIXTURE,
  assets: OVERVIEW_FIXTURE.assets.map((asset) =>
    asset.status === "blocked" ||
    asset.status === "needs_human" ||
    asset.status === "needs_regen"
      ? { ...asset, status: "clear", statusDetail: "Ready to ship" }
      : asset,
  ),
};

export {
  OVERVIEW_ASSETS_EXTRA,
  OVERVIEW_CAMPAIGNS,
  OVERVIEW_EXCEPTIONS,
  OVERVIEW_PROOF_SPEED,
  OVERVIEW_RULE_PRESSURE,
};
