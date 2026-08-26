/**
 * findings.service — human verdict writes.
 * Why: 400 gates from 04-data-model.
 */
import { randomUUID } from "node:crypto";

import type { DecideRequest, FindingMutationResponseDTO, HumanVerdict } from "@preflight/schemas";

import {
  refoldAssetStatus,
  toFindingDTO,
} from "./finding-dto.js";
import { buildDecisionRowData } from "../finding-decisions/finding-decisions.service.js";
import { env } from "../../config/env.js";
import { NotFoundError, ValidationError } from "../../lib/http-error.js";
import { evaluateFinding } from "./judge.service.js";
import { prisma } from "../../lib/prisma.js";

const FINDING_DETAIL_INCLUDE = {
  judgeRun: true,
  decisions: { orderBy: { at: "asc" as const } },
};

function assertHumanActionAllowed(finding: {
  evaluationStatus: string;
  machineVerdict: string | null;
}): void {
  if (finding.evaluationStatus !== "complete") {
    throw new ValidationError("Evaluation is not complete.");
  }

  if (finding.machineVerdict !== "fail") {
    throw new ValidationError("Human verdict requires a failing rule.");
  }
}

async function loadFindingContext(findingId: string): Promise<{
  finding: NonNullable<Awaited<ReturnType<typeof prisma.finding.findUnique>>>;
  asset: NonNullable<Awaited<ReturnType<typeof prisma.asset.findUnique>>>;
}> {
  const finding = await prisma.finding.findUnique({ where: { id: findingId } });

  if (!finding) {
    throw new NotFoundError("Finding not found");
  }

  const asset = await prisma.asset.findUnique({ where: { id: finding.assetId } });

  if (!asset) {
    throw new NotFoundError("Asset not found");
  }

  return { finding, asset };
}

function previousVerdict(finding: { humanVerdict: string | null }): HumanVerdict | null {
  return finding.humanVerdict as HumanVerdict | null;
}

async function reloadFinding(findingId: string, constraintSetId: string) {
  const updated = await prisma.finding.findUniqueOrThrow({
    where: { id: findingId },
    include: FINDING_DETAIL_INCLUDE,
  });

  return toFindingDTO(updated, constraintSetId);
}

export async function waiveFinding(
  findingId: string,
  reason: string,
): Promise<FindingMutationResponseDTO> {
  const { finding, asset } = await loadFindingContext(findingId);
  assertHumanActionAllowed(finding);

  const now = new Date();

  await prisma.$transaction([
    prisma.finding.update({
      where: { id: findingId },
      data: {
        humanVerdict: "waived",
        humanReason: reason,
        humanActor: env.DEMO_OPERATOR_NAME,
        humanAt: now,
      },
    }),
    prisma.findingDecision.create({
      data: buildDecisionRowData(
        {
          findingId,
          action: "waive",
          previousVerdict: previousVerdict(finding),
          verdict: "waived",
          reason,
          actor: env.DEMO_OPERATOR_NAME,
          at: now,
        },
        randomUUID(),
      ),
    }),
  ]);

  const status = await refoldAssetStatus(asset.id, asset.constraintSetId);

  return {
    finding: await reloadFinding(findingId, asset.constraintSetId),
    status,
  };
}

export async function decideFinding(
  findingId: string,
  body: DecideRequest,
): Promise<FindingMutationResponseDTO> {
  const { finding, asset } = await loadFindingContext(findingId);
  assertHumanActionAllowed(finding);

  if (finding.kind === "deterministic") {
    throw new ValidationError("Confirm and override apply to judgement failures only.");
  }

  const now = new Date();
  const action = body.verdict === "confirmed" ? "confirm" : "override";

  await prisma.$transaction([
    prisma.finding.update({
      where: { id: findingId },
      data: {
        humanVerdict: body.verdict,
        humanReason: body.verdict === "overridden" ? body.reason : null,
        humanActor: env.DEMO_OPERATOR_NAME,
        humanAt: now,
      },
    }),
    prisma.findingDecision.create({
      data: buildDecisionRowData(
        {
          findingId,
          action,
          previousVerdict: previousVerdict(finding),
          verdict: body.verdict,
          reason: body.verdict === "overridden" ? body.reason : null,
          actor: env.DEMO_OPERATOR_NAME,
          at: now,
        },
        randomUUID(),
      ),
    }),
  ]);

  const status = await refoldAssetStatus(asset.id, asset.constraintSetId);

  return {
    finding: await reloadFinding(findingId, asset.constraintSetId),
    status,
  };
}

export async function retryFinding(
  findingId: string,
): Promise<FindingMutationResponseDTO> {
  const { finding, asset } = await loadFindingContext(findingId);

  if (finding.evaluationStatus !== "unavailable") {
    throw new ValidationError("Retry is only available for unavailable evaluations.");
  }

  if (finding.kind !== "judgement") {
    throw new ValidationError("Retry applies to judgement evaluations only.");
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.finding.update({
      where: { id: findingId },
      data: {
        evaluationStatus: "pending",
        machineVerdict: null,
        machineReason: null,
        spans: [],
        machineAt: null,
      },
    }),
    prisma.findingDecision.create({
      data: buildDecisionRowData(
        {
          findingId,
          action: "retry",
          previousVerdict: previousVerdict(finding),
          verdict: null,
          reason: null,
          actor: env.DEMO_OPERATOR_NAME,
          at: now,
        },
        randomUUID(),
      ),
    }),
  ]);

  void evaluateFinding(findingId);

  const status = await refoldAssetStatus(asset.id, asset.constraintSetId);

  return {
    finding: await reloadFinding(findingId, asset.constraintSetId),
    status,
  };
}
