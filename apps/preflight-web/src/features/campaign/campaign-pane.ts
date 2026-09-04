/**
 * campaign-pane — Screen 3 four-pane selection and copy helpers.
 * Why: extracted from lib.ts for file size; 09 Screen 3 pane logic.
 */

import type { AssetListItemDTO, AssetStatus, StructuredBriefInput } from "@preflight/schemas";
import type { BriefField } from "@preflight/schemas";

import type { CampaignStepId } from "@/features/campaign/CampaignStepRail";
import type { BuildPhase } from "@/features/campaign/types";

export type CampaignPane = "brief" | "building" | "freeze" | "built";

export type PaneOverride = "freeze" | "brief-edit" | null;

export interface FieldReviewRow {
  field: BriefField;
  label: string;
  value: string;
  editable: boolean;
}

const NEEDS_HUMAN: AssetStatus[] = ["blocked", "needs_human", "needs_regen"];

export function activeCampaignPane(input: {
  hasAssets: boolean;
  buildInFlight: boolean;
  buildPhase: BuildPhase;
  paneOverride: PaneOverride;
  railView: CampaignStepId;
}): CampaignPane {
  if (input.paneOverride === "freeze") {
    return "freeze";
  }
  if (input.paneOverride === "brief-edit") {
    return "brief";
  }
  if (input.buildInFlight) {
    return "building";
  }
  if (input.buildPhase === "needs_ack") {
    return "freeze";
  }
  if (input.railView === "campaign-constraints") {
    return "freeze";
  }
  if (
    input.hasAssets &&
    input.buildPhase !== "needs_input" &&
    input.railView !== "campaign-brief"
  ) {
    return "built";
  }
  return "brief";
}

export function railStepForPane(pane: CampaignPane): CampaignStepId {
  if (pane === "freeze") {
    return "campaign-constraints";
  }
  if (pane === "built") {
    return "campaign-generate";
  }
  return "campaign-brief";
}

function formatChannels(channels: StructuredBriefInput["channels"]): string {
  if (channels.length === 0) {
    return "—";
  }
  return channels.join(", ");
}

function formatFigures(
  figures: StructuredBriefInput["performanceFigures"],
): string {
  if (figures.length === 0) {
    return "None";
  }
  return figures
    .map((figure) =>
      figure.period.trim().length > 0
        ? `${figure.value} (${figure.period})`
        : figure.value,
    )
    .join("; ");
}

function formatClaims(claims: StructuredBriefInput["claims"]): string {
  if (claims.length === 0) {
    return "None";
  }
  return claims.join("; ");
}

export function formatBriefSummary(brief: StructuredBriefInput): string {
  const parts = [
    brief.objective.trim(),
    brief.schemeName.trim(),
    brief.schemeCategory.trim(),
    brief.audience.trim(),
    formatChannels(brief.channels),
    brief.market.trim(),
  ].filter((part) => part.length > 0 && part !== "—" && part !== "None");

  if (parts.length === 0) {
    return "—";
  }
  return parts.join(" · ");
}

export function fieldReviewRows(brief: StructuredBriefInput): FieldReviewRow[] {
  return [
    { field: "objective", label: "Objective", value: brief.objective, editable: true },
    { field: "schemeName", label: "Scheme name", value: brief.schemeName, editable: true },
    {
      field: "schemeCategory",
      label: "Scheme category",
      value: brief.schemeCategory,
      editable: true,
    },
    { field: "audience", label: "Audience", value: brief.audience, editable: true },
    {
      field: "channels",
      label: "Channels",
      value: formatChannels(brief.channels),
      editable: true,
    },
    { field: "market", label: "Market", value: brief.market, editable: true },
    {
      field: "performanceFigures",
      label: "Performance figures",
      value: formatFigures(brief.performanceFigures),
      editable: true,
    },
    { field: "claims", label: "Claims", value: formatClaims(brief.claims), editable: true },
  ];
}

export function countNeedsHuman(assets: AssetListItemDTO[]): number {
  return assets.filter((asset) => NEEDS_HUMAN.includes(asset.status)).length;
}

export function countPendingFindings(assets: AssetListItemDTO[]): number {
  return assets.reduce((total, asset) => total + asset.pendingCount, 0);
}

export function campaignProgressLine(assets: AssetListItemDTO[]): string {
  const total = assets.length;
  if (total === 0) {
    return "";
  }
  const needsHuman = countNeedsHuman(assets);
  const settled =
    needsHuman > 0
      ? `${needsHuman} of ${total} still need a human decision.`
      : `All ${total} ready to ship.`;
  const pending = countPendingFindings(assets);
  if (pending === 0) {
    return settled;
  }
  return `${settled} Evaluating ${pending} rules…`;
}

export function campaignEndLine(assets: AssetListItemDTO[]): string {
  const total = assets.length;
  if (total === 0) {
    return "End of campaign";
  }
  const needsHuman = countNeedsHuman(assets);
  if (needsHuman > 0) {
    return `End of campaign — ${total} assets · ${needsHuman} still need a human`;
  }
  return `End of campaign — all ${total} ready to ship`;
}

export function buildPhaseLine(
  phase: BuildPhase,
  inFlight: boolean,
): string | null {
  if (!inFlight && phase === "idle") {
    return null;
  }
  if (!inFlight && phase === "needs_input") {
    return "Add the highlighted fields, then build again.";
  }
  if (!inFlight && phase === "needs_ack") {
    return "No rules apply to this brief — acknowledge to continue.";
  }
  if (!inFlight && phase === "failed") {
    return "Build failed — fix the issue and try again.";
  }
  if (inFlight && phase === "idle") {
    return "Starting build…";
  }
  const labels: Partial<Record<BuildPhase, string>> = {
    extract: "Structuring your brief…",
    save: "Saving your brief…",
    compile: "Freezing the rules that apply to this brief…",
    generate: "Writing copy for each channel…",
  };
  return labels[phase] ?? null;
}
