/**
 * types — Overview-only mock shapes.
 * Why: proof-speed and rule-pressure aggregates are not wire DTOs.
 */

import type { AssetListItemDTO } from "@preflight/schemas";

export interface OverviewCampaignMeta {
  id: string;
  name: string;
  inProgress: boolean;
}

export interface OverviewExceptionRow {
  assetId: string;
  headline: string;
  campaignName: string;
  ruleId: string;
  frozenWording: string;
  humanReason: string;
  humanActor: string;
  humanAt: string;
}

export interface WeekClearPoint {
  weekLabel: string;
  medianHours: number;
}

export interface ProofSpeedSnapshot {
  medianHoursToClear: number;
  regenerationsPerAsset: number;
  firstPassRatePercent: number;
  weeklyMedianHours: WeekClearPoint[];
}

export interface RulePressureRow {
  ruleId: string;
  kind: "deterministic" | "judgement";
  wording: string;
  eventCount: number;
  assetCount: number;
}

export interface RulePressureSnapshot {
  mostFailed: RulePressureRow[];
  mostWaived: RulePressureRow[];
  driftAssetCount: number;
}

export type OverviewSectionId =
  | "needsYou"
  | "exceptions"
  | "proofSpeed"
  | "rulePressure";

export interface OverviewData {
  assets: AssetListItemDTO[];
  campaigns: OverviewCampaignMeta[];
  exceptions: OverviewExceptionRow[];
  proofSpeed: ProofSpeedSnapshot;
  rulePressure: RulePressureSnapshot;
}
