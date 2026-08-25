/**
 * campaign-nav.service — resolve Campaign nav target id.
 * Why: TopBar needs latest campaign or create-on-404.
 */

import { ApiClientError } from "@/lib/api";

import {
  createCampaignService,
  getLatestCampaignIdService,
} from "@/features/campaign/campaign.service";

export async function resolveCampaignNavService(
  signal: AbortSignal,
): Promise<string> {
  try {
    const latest = await getLatestCampaignIdService(signal);
    return latest.id;
  } catch (error: unknown) {
    if (error instanceof ApiClientError && error.kind === "not_found") {
      try {
        const created = await createCampaignService({ freeText: "" }, signal);
        return created.id;
      } catch (createError: unknown) {
        const message =
          createError instanceof Error
            ? createError.message
            : "resolveCampaignNavService create failed";
        throw new Error(`resolveCampaignNavService: ${message}`, {
          cause: createError,
        });
      }
    }

    if (error instanceof ApiClientError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "resolveCampaignNavService failed";
    throw new Error(`resolveCampaignNavService: ${message}`, { cause: error });
  }
}
