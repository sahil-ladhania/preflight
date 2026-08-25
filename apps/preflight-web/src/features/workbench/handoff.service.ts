/**
 * handoff.service — Workbench → Campaign extract sequence.
 * Why: doc 19 §9.3 client handoff without new endpoints.
 */

import type { ExtractorOutput } from "@preflight/schemas";

import {
  createCampaignService,
  extractCampaignBriefService,
  getCampaignService,
  getLatestCampaignIdService,
} from "@/features/campaign/campaign.service";
import { ApiClientError } from "@/lib/api";

export interface WorkbenchHandoffResult {
  campaignId: string;
  proposal: ExtractorOutput;
  freeText: string;
}

export function buildHandoffFreeText(userTexts: string[]): string {
  return userTexts
    .map((text) => text.trim())
    .filter((text) => text.length > 0)
    .join("\n\n");
}

function campaignBriefInUse(freeText: string, hasStructuredBrief: boolean): boolean {
  return freeText.trim().length > 0 || hasStructuredBrief;
}

export async function resolveCampaignForHandoff(
  signal: AbortSignal,
): Promise<string> {
  try {
    const latest = await getLatestCampaignIdService(signal);
    const campaign = await getCampaignService(latest.id, signal);
    if (
      campaignBriefInUse(
        campaign.freeText,
        campaign.structuredBrief !== null,
      )
    ) {
      const created = await createCampaignService({ freeText: "" }, signal);
      return created.id;
    }
    return latest.id;
  } catch (error: unknown) {
    if (error instanceof ApiClientError && error.kind === "not_found") {
      const created = await createCampaignService({ freeText: "" }, signal);
      return created.id;
    }
    if (error instanceof ApiClientError) {
      throw error;
    }
    const message =
      error instanceof Error
        ? error.message
        : "resolveCampaignForHandoff failed";
    throw new Error(message, { cause: error });
  }
}

export async function handoffExtract(
  campaignId: string,
  freeText: string,
  signal: AbortSignal,
): Promise<WorkbenchHandoffResult> {
  const proposal = await extractCampaignBriefService(
    campaignId,
    { freeText },
    signal,
  );
  return { campaignId, proposal, freeText };
}
