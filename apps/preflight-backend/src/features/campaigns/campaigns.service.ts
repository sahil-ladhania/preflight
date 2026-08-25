/**
 * campaigns.service — Campaign reads and delegation.
 * Why: delegates compile and generate (14-backend-design.md Area 3).
 */
import type {
  CampaignDTO,
  LatestCampaignResponse,
  StructuredBriefInput,
} from "@preflight/schemas";
import { StructuredBriefSchema } from "@preflight/schemas";

import { NotFoundError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { toIso } from "../findings/finding-dto.js";
import { compileCampaign, loadLastCompile } from "./compile.service.js";
import { extractBrief } from "./extract.service.js";
import { generateAssets } from "./generate.service.js";

export { compileCampaign, extractBrief, generateAssets };

async function mapCampaignToDTO(
  campaign: NonNullable<Awaited<ReturnType<typeof prisma.campaign.findUnique>>>,
): Promise<CampaignDTO> {
  const structuredBrief =
    campaign.structuredBrief === null
      ? null
      : StructuredBriefSchema.parse(campaign.structuredBrief);

  let lastCompile = null;

  if (campaign.currentConstraintSetId && structuredBrief) {
    lastCompile = await loadLastCompile(
      campaign.currentConstraintSetId,
      structuredBrief,
    );
  }

  return {
    id: campaign.id,
    freeText: campaign.freeText,
    structuredBrief,
    currentConstraintSetId: campaign.currentConstraintSetId,
    updatedAt: toIso(campaign.updatedAt),
    lastCompile,
  };
}

export async function createCampaign(freeText = ""): Promise<CampaignDTO> {
  const campaign = await prisma.campaign.create({
    data: { freeText },
  });

  return mapCampaignToDTO(campaign);
}

export async function getLatestCampaign(): Promise<LatestCampaignResponse> {
  const campaign = await prisma.campaign.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  if (!campaign) {
    throw new NotFoundError("No campaign found");
  }

  return { id: campaign.id };
}

export async function getCampaignById(id: string): Promise<CampaignDTO> {
  const campaign = await prisma.campaign.findUnique({ where: { id } });

  if (!campaign) {
    throw new NotFoundError("Campaign not found");
  }

  return mapCampaignToDTO(campaign);
}

export async function updateBrief(
  id: string,
  brief: StructuredBriefInput,
): Promise<CampaignDTO> {
  const existing = await prisma.campaign.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError("Campaign not found");
  }

  const campaign = await prisma.campaign.update({
    where: { id },
    data: { structuredBrief: brief },
  });

  return mapCampaignToDTO(campaign);
}
