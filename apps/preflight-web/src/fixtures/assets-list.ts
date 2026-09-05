/**
 * assets-list — static list fixture for Screen 2 pixels.
 * Why: statusDetail is pre-computed here; server derives at read in wiring session.
 */

import type { AssetListItemDTO } from "@preflight/schemas";

/** Seed campaign id — keep in sync with fixtures/campaign.ts CAMPAIGN_ID. */
const CAMPAIGN_ID = "22222222-2222-4222-8222-222222222222";

export const ASSET_ID_A = "a1b2c3d4-7f01-4111-8111-0000000000a1";
export const ASSET_ID_B = "b7e4a210-7f02-4111-8111-0000000000b2";
export const ASSET_ID_C = "c3d5e607-7f03-4111-8111-0000000000c3";
export const ASSET_ID_D = "d4e60819-7f04-4111-8111-0000000000d4";
export const ASSET_ID_E = "e5f7192a-7f05-4111-8111-0000000000e5";
export const ASSET_ID_F = "f6082a3b-7f06-4111-8111-0000000000f6";
export const ASSET_ID_G = "07193b4c-7f07-4111-8111-0000000000a7";
export const ASSET_ID_H = "182a4c5d-7f08-4111-8111-0000000000b8";

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
    statusDetail: "Checking 2 rules…",
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
    statusDetail: "SEBI-06 needs your decision",
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
    statusDetail: "You confirmed SEBI-06 — needs regenerating",
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
    statusDetail: "BRAND-03 needs your decision",
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
    statusDetail: "SEBI-06 could not be evaluated — retry",
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
    statusDetail: "Ships with 1 waived exception",
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
    statusDetail: "Fails SEBI-01 — must be fixed or waived",
  },
];
