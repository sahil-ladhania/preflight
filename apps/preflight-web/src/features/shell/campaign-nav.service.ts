/**
 * campaign-nav.service — Campaign nav resolve latest + Workbench handoff.
 * Why: top nav resolves latest; Workbench handoff creates only on 404.
 */

import { ApiClientError } from "@/lib/api";

import {
  createCampaignService,
  getLatestCampaignIdService,
} from "@/features/campaign/campaign.service";

export async function createNewCampaignNavService(
  signal: AbortSignal,
): Promise<string> {
  try {
    const created = await createCampaignService({ freeText: "" }, signal);
    return created.id;
  } catch (error: unknown) {
    if (error instanceof ApiClientError) {
      throw error;
    }

    const message =
      error instanceof Error
        ? error.message
        : "createNewCampaignNavService failed";
    throw new Error(`createNewCampaignNavService: ${message}`, { cause: error });
  }
}

/** Workbench handoff — latest campaign, or create when none exist. */
export async function resolveWorkbenchCampaignHandoff(
  signal: AbortSignal,
): Promise<string> {
  try {
    const latest = await getLatestCampaignIdService(signal);
    return latest.id;
  } catch (error: unknown) {
    if (error instanceof ApiClientError && error.kind === "not_found") {
      return createNewCampaignNavService(signal);
    }

    if (error instanceof ApiClientError) {
      throw error;
    }

    const message =
      error instanceof Error
        ? error.message
        : "resolveWorkbenchCampaignHandoff failed";
    throw new Error(`resolveWorkbenchCampaignHandoff: ${message}`, {
      cause: error,
    });
  }
}
