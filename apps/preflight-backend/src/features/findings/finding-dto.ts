/**
 * finding-dto — Prisma finding row → wire DTO helpers.
 * Why: shared by assets and findings services (14-backend-design.md Area 3).
 */
import type { AgentRun, Finding } from "@prisma/client";

import {
  foldStatus,
  type FindingDTO,
  type FoldFinding,
  type IsoDateTime,
  type Span,
} from "@preflight/schemas";

import { toAgentRunSummary } from "../agent-runs/agent-run-dto.js";
import { InternalError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

export function toIso(date: Date): IsoDateTime {
  return date.toISOString();
}

export function parseSpans(value: unknown): Span[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value as Span[];
}

export async function loadSnapshotWording(
  constraintSetId: string,
  ruleId: string,
): Promise<string> {
  const snapshot = await prisma.constraintSnapshot.findUnique({
    where: {
      constraintSetId_ruleId: { constraintSetId, ruleId },
    },
    select: { wording: true },
  });

  if (!snapshot) {
    throw new InternalError("Internal server error.");
  }

  return snapshot.wording;
}

export async function toFindingDTO(
  row: Finding & { judgeRun?: AgentRun | null },
  constraintSetId: string,
): Promise<FindingDTO> {
  const frozenWording = await loadSnapshotWording(constraintSetId, row.ruleId);

  return {
    id: row.id,
    ruleId: row.ruleId,
    kind: row.kind as FindingDTO["kind"],
    frozenWording,
    evaluationStatus: row.evaluationStatus as FindingDTO["evaluationStatus"],
    machineVerdict: row.machineVerdict as FindingDTO["machineVerdict"],
    machineReason: row.machineReason,
    spans: parseSpans(row.spans),
    machineAt: row.machineAt ? toIso(row.machineAt) : null,
    humanVerdict: row.humanVerdict as FindingDTO["humanVerdict"],
    humanReason: row.humanReason,
    humanActor: row.humanActor,
    humanAt: row.humanAt ? toIso(row.humanAt) : null,
    judgeRun: toAgentRunSummary(row.judgeRun ?? null),
  };
}

export function toFoldFinding(dto: FindingDTO): FoldFinding {
  return {
    kind: dto.kind,
    evaluationStatus: dto.evaluationStatus,
    machineVerdict: dto.machineVerdict,
    humanVerdict: dto.humanVerdict,
  };
}

export function toFoldFindingFromRow(row: Finding): FoldFinding {
  return {
    kind: row.kind as FoldFinding["kind"],
    evaluationStatus: row.evaluationStatus as FoldFinding["evaluationStatus"],
    machineVerdict: row.machineVerdict as FoldFinding["machineVerdict"],
    humanVerdict: row.humanVerdict as FoldFinding["humanVerdict"],
  };
}

export async function refoldAssetStatus(
  assetId: string,
  constraintSetId: string,
): Promise<ReturnType<typeof foldStatus>> {
  const rows = await prisma.finding.findMany({ where: { assetId } });
  const dtos = await Promise.all(rows.map((row) => toFindingDTO(row, constraintSetId)));
  return foldStatus(dtos.map(toFoldFinding));
}
