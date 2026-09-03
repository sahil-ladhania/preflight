/**
 * assets-list — static list fixture for Screen 2 pixels.
 * Why: statusDetail is pre-computed here; server derives at read in wiring session.
 */

import type { AssetListItemDTO } from "@preflight/schemas";

/** Seed campaign id — keep in sync with fixtures/campaign.ts CAMPAIGN_ID. */
const CAMPAIGN_ID = "22222222-2222-4222-8222-222222222222";

export const ASSET_ID_A = "11111111-1111-4111-8111-111111111101";
export const ASSET_ID_B = "11111111-1111-4111-8111-111111111102";
export const ASSET_ID_C = "11111111-1111-4111-8111-111111111103";
export const ASSET_ID_D = "11111111-1111-4111-8111-111111111104";
export const ASSET_ID_E = "11111111-1111-4111-8111-111111111105";
export const ASSET_ID_F = "11111111-1111-4111-8111-111111111106";
export const ASSET_ID_G = "11111111-1111-4111-8111-111111111107";
export const ASSET_ID_H = "11111111-1111-4111-8111-111111111108";

/** Seed campaign name — keep in sync with fixtures/campaign brief schemeName. */
const CAMPAIGN_NAME = "Bluepeak Flexi Cap Fund";

/** Newest first — matches fixed generatedAt desc sort. */
export const ASSETS_LIST_FIXTURE: AssetListItemDTO[] = [
  {
    id: ASSET_ID_H,
    campaignId: CAMPAIGN_ID,
    campaignName: CAMPAIGN_NAME,
    channel: "email",
    headline: "Bluepeak Flexi Cap — email fan-out in progress",
    status: "needs_human",
    generationIndex: 1,
    regeneratedFromId: null,
    generatedAt: "2026-03-15T14:00:00.000Z",
    pendingCount: 2,
    statusDetail: "Evaluating 2 rule(s)…",
  },
  {
    id: ASSET_ID_B,
    campaignId: CAMPAIGN_ID,
    campaignName: CAMPAIGN_NAME,
    channel: "linkedin",
    headline: "Bluepeak Flexi Cap — LinkedIn post (regenerated)",
    status: "needs_human",
    generationIndex: 2,
    regeneratedFromId: ASSET_ID_A,
    generatedAt: "2026-03-15T12:30:00.000Z",
    pendingCount: 0,
    statusDetail: "Review: SEBI-06",
  },
  {
    id: ASSET_ID_A,
    campaignId: CAMPAIGN_ID,
    campaignName: CAMPAIGN_NAME,
    channel: "display",
    headline: "Bluepeak Flexi Cap — display banner",
    status: "needs_regen",
    generationIndex: 1,
    regeneratedFromId: null,
    generatedAt: "2026-03-15T11:00:00.000Z",
    pendingCount: 0,
    statusDetail: "Confirmed fail: SEBI-06",
  },
  {
    id: ASSET_ID_G,
    campaignId: CAMPAIGN_ID,
    campaignName: CAMPAIGN_NAME,
    channel: "whatsapp",
    headline: "Bluepeak Flexi Cap — WhatsApp broadcast",
    status: "needs_human",
    generationIndex: 1,
    regeneratedFromId: null,
    generatedAt: "2026-03-14T16:00:00.000Z",
    pendingCount: 0,
    statusDetail: "Review: BRAND-03",
  },
  {
    id: ASSET_ID_F,
    campaignId: CAMPAIGN_ID,
    campaignName: CAMPAIGN_NAME,
    channel: "landing",
    headline: "Bluepeak Flexi Cap — landing page hero",
    status: "needs_human",
    generationIndex: 1,
    regeneratedFromId: null,
    generatedAt: "2026-03-14T14:00:00.000Z",
    pendingCount: 0,
    statusDetail: "Review: SEBI-06, unavailable",
  },
  {
    id: ASSET_ID_E,
    campaignId: CAMPAIGN_ID,
    campaignName: CAMPAIGN_NAME,
    channel: "email",
    headline: "Bluepeak Flexi Cap — email newsletter",
    status: "clear",
    generationIndex: 1,
    regeneratedFromId: null,
    generatedAt: "2026-03-14T10:00:00.000Z",
    pendingCount: 0,
    statusDetail: "Ready to ship",
  },
  {
    id: ASSET_ID_D,
    campaignId: CAMPAIGN_ID,
    campaignName: CAMPAIGN_NAME,
    channel: "display",
    headline: "Bluepeak Flexi Cap — display static",
    status: "cleared_with_exception",
    generationIndex: 1,
    regeneratedFromId: null,
    generatedAt: "2026-03-13T15:00:00.000Z",
    pendingCount: 0,
    statusDetail: "1 waived exception(s)",
  },
  {
    id: ASSET_ID_C,
    campaignId: CAMPAIGN_ID,
    campaignName: CAMPAIGN_NAME,
    channel: "whatsapp",
    headline: "Bluepeak Flexi Cap — WhatsApp status",
    status: "blocked",
    generationIndex: 1,
    regeneratedFromId: null,
    generatedAt: "2026-03-13T09:00:00.000Z",
    pendingCount: 0,
    statusDetail: "Deterministic fail: SEBI-01",
  },
];
