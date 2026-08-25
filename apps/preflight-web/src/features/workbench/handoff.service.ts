/**
 * handoff.service — Workbench → Campaign id resolution.
 * Why: doc 19 §9.3 client handoff without new endpoints.
 */

import {
  createCampaignService,
  getCampaignService,
  getLatestCampaignIdService,
} from "@/features/campaign/campaign.service";
import { ApiClientError } from "@/lib/api";

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
