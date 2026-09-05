/**
 * campaigns — Overview campaign metadata fixture.
 * Why: state line counts campaigns in progress separately from assets.
 */

import type { OverviewCampaignMeta } from "@/features/overview/types";

export const OVERVIEW_CAMPAIGN_BLUEPEAK =
  "22222222-2222-4222-8222-222222222222";

export const OVERVIEW_CAMPAIGNS: OverviewCampaignMeta[] = [
  {
    id: OVERVIEW_CAMPAIGN_BLUEPEAK,
    name: "Bluepeak Flexi Cap Fund",
    inProgress: true,
  },
  {
    id: "11111111-1111-4111-8111-111111111101",
    name: "Nippon India Small Cap Fund",
    inProgress: true,
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    name: "SBI Magnum Gilt Fund",
    inProgress: false,
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    name: "ICICI Prudential Value Discovery Fund",
    inProgress: false,
  },
  {
    id: "11111111-1111-4111-8111-111111111104",
    name: "Axis Long Term Equity Fund (ELSS)",
    inProgress: false,
  },
  {
    id: "11111111-1111-4111-8111-111111111105",
    name: "Kotak Emerging Equity Fund",
    inProgress: false,
  },
];
