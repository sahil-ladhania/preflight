/**
 * generate.service — generate birth path.
 * Why: live generator → canonicalText → runDeterministic → asset txn → fan-out judge.
 */
// size: orchestration + txn + per-channel prep; canonical builder extracted
import { randomUUID } from "node:crypto";

import type { Prisma } from "@prisma/client";

import {
  hashRun,
  runDeterministic,
  type DetRunRule,
} from "@preflight/rules";
import {
  StructuredBriefSchema,
  type Channel,
  type GenerateResponseDTO,
} from "@preflight/schemas";

import { fanOutJudgement } from "../findings/judge.service.js";
import { getPackageMatch } from "../../lib/catalog.js";
import { InternalError, NotFoundError, ValidationError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { buildCanonicalText } from "./generate-canonical.js";
import { callGenerator } from "./generate-agent.js";

interface PreparedChannel {
  channel: Channel;
  output: Awaited<ReturnType<typeof callGenerator>>;
  canonicalText: string;
  fieldOffsets: ReturnType<typeof buildCanonicalText>["fieldOffsets"];
  runHash: string;
  detFindings: ReturnType<typeof runDeterministic>["findings"];
}

function snapshotRules(
  snapshots: Array<{ ruleId: string; kind: string; wording: string }>,
): Array<{ ruleId: string; kind: "deterministic" | "judgement"; wording: string }> {
  return snapshots.map((snapshot) => ({
    ruleId: snapshot.ruleId,
    kind: snapshot.kind as "deterministic" | "judgement",
    wording: snapshot.wording,
  }));
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
    channels = [...structuredBrief.channels];
  }

  const ruleWordings = snapshotRules(snapshots);

  const rulesetHash = constraintSet.rulesetHash;

  async function prepareChannel(channel: Channel): Promise<PreparedChannel> {
    const output = await callGenerator(channel, structuredBrief, ruleWordings);
    const { canonicalText, fieldOffsets } = buildCanonicalText(output);
    const { findings } = runDeterministicSafe(canonicalText, detRules);
    const matcherOutputs = findings.map((finding) => ({
      ruleId: finding.ruleId,
      machineVerdict: finding.machineVerdict,
      spans: finding.spans,
    }));
    const runHash = hashRun({
      canonicalText,
      rulesetHash,
      matcherOutputs,
    });

    return {
      channel,
      output,
      canonicalText,
      fieldOffsets,
      runHash,
      detFindings: findings,
    };
  }

  const prepared = await Promise.all(channels.map(prepareChannel));

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
