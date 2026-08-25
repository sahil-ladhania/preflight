/**
 * generate.service — generate birth path.
 * Why: stub generator → canonicalText → runDeterministic → asset txn → fan-out judge.
 */
// size: orchestration + txn + per-channel prep; canonical builder extracted
import { randomUUID } from "node:crypto";

import type { Prisma } from "@prisma/client";

import {
  hashRun,
  runDeterministic,
  type DetRunRule,
  type StructuredBrief,
} from "@preflight/rules";
import {
  GeneratorOutputSchema,
  StructuredBriefSchema,
  type Channel,
  type GenerateResponseDTO,
  type GeneratorOutput,
} from "@preflight/schemas";

import { fanOutJudgement } from "../findings/judge.service.js";
import { getPackageMatch } from "../../lib/catalog.js";
import { InternalError, NotFoundError, ValidationError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { toStructuredBrief } from "./brief-adapter.js";
import { buildCanonicalText } from "./generate-canonical.js";

interface PreparedChannel {
  channel: Channel;
  output: GeneratorOutput;
  canonicalText: string;
  fieldOffsets: ReturnType<typeof buildCanonicalText>["fieldOffsets"];
  runHash: string;
  detFindings: ReturnType<typeof runDeterministic>["findings"];
}

function stubGeneratorOutput(brief: StructuredBrief, channel: Channel): GeneratorOutput {
  const primaryClaim = brief.claims[0] ?? "strong outcomes";

  return {
    headline: `${brief.schemeName} — ${channel} outreach`,
    body: `${brief.objective} Discover ${brief.schemeName} with ${primaryClaim}.`,
    disclaimer: "Mutual fund investments are subject to market risks.",
    cta: "Invest today",
  };
}

function bindDetRunRules(
  snapshots: Array<{
    ruleId: string;
    kind: string;
    wording: string;
    predicateFingerprint: string;
    matcherFingerprint: string | null;
  }>,
): DetRunRule[] {
  return snapshots
    .filter((snapshot) => snapshot.kind === "deterministic")
    .map((snapshot) => {
      const match = getPackageMatch(snapshot.ruleId);

      if (!match) {
        throw new InternalError("Deterministic engine error.");
      }

      return {
        id: snapshot.ruleId,
        kind: "deterministic" as const,
        wording: snapshot.wording,
        predicateFingerprint: snapshot.predicateFingerprint,
        matcherFingerprint: snapshot.matcherFingerprint ?? "",
        match,
      };
    });
}

function runDeterministicSafe(
  canonicalText: string,
  rules: DetRunRule[],
): ReturnType<typeof runDeterministic> {
  try {
    return runDeterministic({ canonicalText, rules });
  } catch {
    throw new InternalError("Deterministic engine error.");
  }
}

export async function generateAssets(
  campaignId: string,
  regeneratedFromId?: string,
): Promise<GenerateResponseDTO> {
  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });

  if (!campaign) {
    throw new NotFoundError("Campaign not found");
  }

  if (campaign.structuredBrief === null) {
    throw new ValidationError("Save brief before generating.");
  }

  if (campaign.currentConstraintSetId === null) {
    throw new ValidationError("Compile a constraint set first.");
  }

  const structuredBrief = StructuredBriefSchema.parse(campaign.structuredBrief);
  const brief = toStructuredBrief(structuredBrief);

  const constraintSet = await prisma.constraintSet.findUnique({
    where: { id: campaign.currentConstraintSetId },
  });

  if (!constraintSet) {
    throw new ValidationError("Compile a constraint set first.");
  }

  const snapshots = await prisma.constraintSnapshot.findMany({
    where: { constraintSetId: constraintSet.id },
  });
  const detRules = bindDetRunRules(snapshots);
  const judgementSnapshots = snapshots.filter((snapshot) => snapshot.kind === "judgement");

  let channels: Channel[];
  let generationIndex = 1;
  let regenFromId: string | null = null;

  if (regeneratedFromId) {
    const parent = await prisma.asset.findUnique({ where: { id: regeneratedFromId } });

    if (!parent) {
      throw new ValidationError("Regenerated asset not found.");
    }

    if (parent.campaignId !== campaignId) {
      throw new ValidationError("Regenerated asset does not belong to this campaign.");
    }

    channels = [parent.channel as Channel];
    generationIndex = parent.generationIndex + 1;
    regenFromId = parent.id;
  } else {
    channels = [...brief.channels];
  }

  const prepared: PreparedChannel[] = [];

  for (const channel of channels) {
    const output = GeneratorOutputSchema.parse(stubGeneratorOutput(brief, channel));
    const { canonicalText, fieldOffsets } = buildCanonicalText(output);
    const { findings } = runDeterministicSafe(canonicalText, detRules);
    const matcherOutputs = findings.map((finding) => ({
      ruleId: finding.ruleId,
      machineVerdict: finding.machineVerdict,
      spans: finding.spans,
    }));
    const runHash = hashRun({
      canonicalText,
      rulesetHash: constraintSet.rulesetHash,
      matcherOutputs,
    });

    prepared.push({
      channel,
      output,
      canonicalText,
      fieldOffsets,
      runHash,
      detFindings: findings,
    });
  }

  const now = new Date();
  const assetIds: string[] = [];

  await prisma.$transaction(async (tx) => {
    for (const row of prepared) {
      const assetId = randomUUID();
      assetIds.push(assetId);

      await tx.asset.create({
        data: {
          id: assetId,
          campaignId,
          channel: row.channel,
          constraintSetId: constraintSet.id,
          headline: row.output.headline,
          body: row.output.body,
          disclaimer: row.output.disclaimer,
          cta: row.output.cta,
          canonicalText: row.canonicalText,
          fieldOffsets: row.fieldOffsets,
          runHash: row.runHash,
          rulesetHash: constraintSet.rulesetHash,
          regeneratedFromId: regenFromId,
          generationIndex,
          findings: {
            create: [
              ...row.detFindings.map((finding) => ({
                id: randomUUID(),
                ruleId: finding.ruleId,
                kind: finding.kind,
                evaluationStatus: "complete",
                machineVerdict: finding.machineVerdict,
                machineReason: finding.machineReason,
                spans: finding.spans as unknown as Prisma.InputJsonValue,
                machineAt: now,
              })),
              ...judgementSnapshots.map((snapshot) => ({
                id: randomUUID(),
                ruleId: snapshot.ruleId,
                kind: "judgement",
                evaluationStatus: "pending",
                machineVerdict: null,
                machineReason: null,
                spans: [],
                machineAt: null,
              })),
            ],
          },
        },
      });
    }
  });

  fanOutJudgement(assetIds);

  return {
    assets: prepared.map((row, index) => ({
      id: assetIds[index] ?? "",
      channel: row.channel,
    })),
  };
}
