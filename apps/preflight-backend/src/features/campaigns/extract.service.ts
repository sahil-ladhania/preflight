/**
 * extract.service — extractor agent call.
 * Why: returns proposal DTO; persists freeText only.
 */
import {
  ExtractorOutputSchema,
  type ExtractorOutput,
  type ExtractResponseDTO,
} from "@preflight/schemas";

import { buildExtractorPrompt } from "../../../agents/extractor.prompt.js";
import { env } from "../../config/env.js";
import { InternalError, NotFoundError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

function stripJsonFence(content: string): string {
  const trimmed = content.trim();
  const match = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  return match?.[1]?.trim() ?? trimmed;
}

function parseExtractorOutput(content: string): ExtractorOutput {
  try {
    const parsed: unknown = JSON.parse(stripJsonFence(content));
    return ExtractorOutputSchema.parse(parsed);
  } catch {
    throw new InternalError("Extract failed.");
  }
}

export async function extractBrief(
  campaignId: string,
  freeText: string,
): Promise<ExtractResponseDTO> {
  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });

  if (!campaign) {
    throw new NotFoundError("Campaign not found");
  }

  await prisma.campaign.update({
    where: { id: campaignId },
    data: { freeText },
  });

  try {
    const prompt = buildExtractorPrompt({ freeText });
    const { runAgent } = await import("../../lib/gitagent.js");
    const { content, skillsRead } = await runAgent("extractor", prompt);
    return { proposal: parseExtractorOutput(content), skillsRead };
  } catch (error) {
    if (error instanceof InternalError) {
      throw error;
    }

    if (env.NODE_ENV === "development") {
      console.error("extractBrief agent failure:", error);
    }

    throw new InternalError("Extract failed.");
  }
}
