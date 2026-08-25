/**
 * handoff.service — Workbench → Campaign id resolution and extract handoff.
 * Why: doc 19 §9.3 client handoff without new endpoints.
 */

import type { StructuredBriefInput } from "@preflight/schemas";

import {
  createCampaignService,
  extractCampaignBriefService,
  getCampaignService,
  getLatestCampaignIdService,
} from "@/features/campaign/campaign.service";
import {
  buildHandoffFreeText,
  handoffBriefFromMessages,
  seedProposalFromExplainer,
} from "@/features/workbench/lib";
import type { WorkbenchMessage } from "@/features/workbench/types";
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

export interface WorkbenchExtractHandoffResult {
  campaignId: string;
  freeText: string;
  proposal: Partial<StructuredBriefInput>;
}

export async function runWorkbenchExtractHandoff(
  messages: WorkbenchMessage[],
  signal: AbortSignal,
): Promise<WorkbenchExtractHandoffResult> {
  const freeText = buildHandoffFreeText(messages);
  if (freeText.length === 0) {
    throw new Error("No conversation text to extract.");
  }

  const campaignId = await resolveCampaignForHandoff(signal);
  const extracted = await extractCampaignBriefService(
    campaignId,
    { freeText },
    signal,
  );
  const proposal = seedProposalFromExplainer(
    extracted,
    handoffBriefFromMessages(messages),
  );

  return { campaignId, freeText, proposal };
}
