/**
 * rule-pressure — failed, waived, and drift aggregates for Overview.
 * Why: uneven SEBI/BRAND distribution makes rankings meaningful.
 */

import { FROZEN_WORDING } from "@/fixtures/assets-detail/shared";

import type { RulePressureSnapshot } from "@/features/overview/types";

export const OVERVIEW_RULE_PRESSURE: RulePressureSnapshot = {
  mostFailed: [
    {
      ruleId: "SEBI-06",
      kind: "judgement",
      wording: FROZEN_WORDING["SEBI-06"],
      eventCount: 14,
      assetCount: 11,
    },
    {
      ruleId: "SEBI-01",
      kind: "deterministic",
      wording: FROZEN_WORDING["SEBI-01"],
      eventCount: 9,
      assetCount: 8,
    },
    {
      ruleId: "BRAND-03",
      kind: "judgement",
      wording: FROZEN_WORDING["BRAND-03"],
      eventCount: 7,
      assetCount: 6,
    },
    {
      ruleId: "SEBI-03",
      kind: "deterministic",
      wording: FROZEN_WORDING["SEBI-03"],
      eventCount: 5,
      assetCount: 5,
    },
  ],
  mostWaived: [
    {
      ruleId: "SEBI-05",
      kind: "deterministic",
      wording: FROZEN_WORDING["SEBI-05"],
      eventCount: 4,
      assetCount: 4,
    },
    {
      ruleId: "BRAND-02",
      kind: "judgement",
      wording: FROZEN_WORDING["BRAND-02"],
      eventCount: 2,
      assetCount: 2,
    },
    {
      ruleId: "SEBI-06",
      kind: "judgement",
      wording: FROZEN_WORDING["SEBI-06"],
      eventCount: 1,
      assetCount: 1,
    },
  ],
  driftAssetCount: 6,
};
