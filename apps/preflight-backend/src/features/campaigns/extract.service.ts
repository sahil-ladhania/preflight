/**
 * extract.service — extractor agent call.
 * Why: returns proposal DTO; persists freeText only.
 */
import {
  ExtractorOutputSchema,
  type ExtractResponseDTO,
  type ExtractorOutput,
} from "@preflight/schemas";

import { buildExtractorPrompt } from "../../../agents/extractor.prompt.js";
import { env } from "../../config/env.js";
import { AgentInvocationError, hashAgentText } from "../../lib/gitagent.js";
import { detectInjectionSignals } from "../../lib/injection-guard.js";
import { InternalError, NotFoundError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { recordAgentRun } from "../agent-runs/agent-runs.service.js";

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

  const injection = detectInjectionSignals(freeText);

  try {
    const prompt = buildExtractorPrompt({ freeText });
    const { runAgent } = await import("../../lib/gitagent.js");
    const { content, skillsRead, meta } = await runAgent("extractor", prompt);

    try {
      const proposal = parseExtractorOutput(content);
      void recordAgentRun(meta, { kind: "campaign", id: campaignId }, injection);
      return { proposal, skillsRead, injection };
    } catch {
      void recordAgentRun(
        {
          ...meta,
          ok: false,
          errorKind: "parse_failed",
          output: content,
          outputHash: hashAgentText(content),
        },
        { kind: "campaign", id: campaignId },
        injection,
      );
      throw new InternalError("Extract failed.");
    }
  } catch (error) {
    if (error instanceof AgentInvocationError) {
      void recordAgentRun(error.meta, { kind: "campaign", id: campaignId }, injection);
      throw new InternalError("Extract failed.");
    }

    if (error instanceof InternalError) {
      throw error;
    }

    if (env.NODE_ENV === "development") {
      console.error("extractBrief agent failure:", error);
    }

    throw new InternalError("Extract failed.");
  }
}
