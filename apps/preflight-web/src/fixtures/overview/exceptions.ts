/**
 * exceptions — standing waiver register for Overview.
 * Why: waivers stay visible forever; every reason attributed to Arjun Legha.
 */

import { FROZEN_WORDING } from "@/fixtures/assets-detail/shared";
import { ASSET_ID_D } from "@/fixtures/assets-list";

import type { OverviewExceptionRow } from "@/features/overview/types";

export const OVERVIEW_EXCEPTIONS: OverviewExceptionRow[] = [
  {
    assetId: ASSET_ID_D,
    headline: "Bluepeak Flexi Cap — display static",
    campaignName: "Bluepeak Flexi Cap Fund",
    ruleId: "SEBI-05",
    frozenWording: FROZEN_WORDING["SEBI-05"],
    humanReason: "Approved exception for internal demo static.",
    humanActor: "Arjun Legha",
    humanAt: "2026-03-13T15:20:00.000Z",
  },
  {
    assetId: "ov-exc-001-4111-8111-000000000001",
    headline: "Nippon Small Cap — LinkedIn thought leadership post",
    campaignName: "Nippon India Small Cap Fund",
    ruleId: "BRAND-02",
    frozenWording: FROZEN_WORDING["BRAND-02"],
    humanReason:
      "Tone drifts slightly informal on the opening hook, but the factual claims are substantiated and the disclaimer is intact. Shipping with exception for the Q4 investor-education series deadline.",
    humanActor: "Arjun Legha",
    humanAt: "2026-02-18T11:45:00.000Z",
  },
  {
    assetId: "ov-exc-002-4111-8111-000000000002",
    headline: "ICICI Value Discovery — email performance update",
    campaignName: "ICICI Prudential Value Discovery Fund",
    ruleId: "SEBI-05",
    frozenWording: FROZEN_WORDING["SEBI-05"],
    humanReason:
      "The CAGR footnote references the correct period in the linked factsheet but the inline copy omits the as-on date. Waiving because the email links to the substantiation page and the desk signed off on the underlying numbers yesterday.",
    humanActor: "Arjun Legha",
    humanAt: "2026-01-29T09:12:00.000Z",
  },
  {
    assetId: "ov-exc-003-4111-8111-000000000003",
    headline: "Kotak Emerging Equity — WhatsApp broadcast",
    campaignName: "Kotak Emerging Equity Fund",
    ruleId: "BRAND-05",
    frozenWording: FROZEN_WORDING["BRAND-05"],
    humanReason:
      "Channel tone is warmer than the written guideline, which is ordinarily a fail, but WhatsApp copy for this scheme was pre-cleared in the January brand refresh and the warmer phrasing matches that annex. Exception recorded so the audit trail shows we knew the deviation.",
    humanActor: "Arjun Legha",
    humanAt: "2025-12-06T16:30:00.000Z",
  },
];
