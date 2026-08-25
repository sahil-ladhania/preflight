/**
 * assets.service — Assets list and detail DTOs.
 * Why: foldStatus; lineage + exceptions derivation.
 */
import type { Finding } from "@prisma/client";

import type {
  AssetDetailDTO,
  AssetListItemDTO,
  AssetsListResponse,
  FieldOffsets,
} from "@preflight/schemas";
import { foldStatus } from "@preflight/schemas";

import {
  buildExceptions,
  buildLineage,
  buildStatusDetail,
  sortFindingsBySnapshotOrder,
} from "./assets-derive.js";
import {
  toFindingDTO,
  toFoldFinding,
  toFoldFindingFromRow,
  toIso,
} from "../findings/finding-dto.js";
import { NotFoundError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

function parseFieldOffsets(value: unknown): FieldOffsets {
  return value as FieldOffsets;
}

function countPendingRows(rows: Finding[]): number {
  return rows.filter((row) => row.evaluationStatus === "pending").length;
}

function toStatusInput(row: Finding) {
  return {
    ruleId: row.ruleId,
    kind: row.kind as AssetDetailDTO["findings"][number]["kind"],
    evaluationStatus: row.evaluationStatus as AssetDetailDTO["findings"][number]["evaluationStatus"],
    machineVerdict: row.machineVerdict as AssetDetailDTO["findings"][number]["machineVerdict"],
    humanVerdict: row.humanVerdict as AssetDetailDTO["findings"][number]["humanVerdict"],
  };
}

async function loadSnapshotOrder(constraintSetId: string): Promise<string[]> {
  const snapshots = await prisma.constraintSnapshot.findMany({
    where: { constraintSetId },
    select: { ruleId: true, kind: true },
  });

  const deterministic = snapshots
    .filter((snapshot) => snapshot.kind === "deterministic")
    .sort((left, right) => left.ruleId.localeCompare(right.ruleId));
  const judgement = snapshots
    .filter((snapshot) => snapshot.kind === "judgement")
    .sort((left, right) => left.ruleId.localeCompare(right.ruleId));

  return [...deterministic, ...judgement].map((snapshot) => snapshot.ruleId);
}

function mapAssetListItem(
  asset: {
    id: string;
    channel: string;
    headline: string;
    generationIndex: number;
    regeneratedFromId: string | null;
    generatedAt: Date;
  },
  findingRows: Finding[],
): AssetListItemDTO {
  const status = foldStatus(findingRows.map(toFoldFindingFromRow));
  const pendingCount = countPendingRows(findingRows);

  return {
    id: asset.id,
    channel: asset.channel as AssetListItemDTO["channel"],
    headline: asset.headline,
    status,
    generationIndex: asset.generationIndex,
    regeneratedFromId: asset.regeneratedFromId,
    generatedAt: toIso(asset.generatedAt),
    pendingCount,
    statusDetail: buildStatusDetail(
      findingRows.map(toStatusInput),
      status,
      pendingCount,
    ),
  };
}

export async function listAssets(): Promise<AssetsListResponse> {
  const assets = await prisma.asset.findMany({
    orderBy: { generatedAt: "desc" },
    select: {
      id: true,
      channel: true,
      headline: true,
      generationIndex: true,
      regeneratedFromId: true,
      generatedAt: true,
    },
  });

  if (assets.length === 0) {
    return { assets: [] };
  }

  const findingRows = await prisma.finding.findMany({
    where: { assetId: { in: assets.map((asset) => asset.id) } },
  });

  const findingsByAssetId = new Map<string, Finding[]>();
  for (const row of findingRows) {
    const bucket = findingsByAssetId.get(row.assetId) ?? [];
    bucket.push(row);
    findingsByAssetId.set(row.assetId, bucket);
  }

  const listItems = assets.map((asset) =>
    mapAssetListItem(asset, findingsByAssetId.get(asset.id) ?? []),
  );

  return { assets: listItems };
}

export async function getAssetDetail(id: string): Promise<AssetDetailDTO> {
  const asset = await prisma.asset.findUnique({ where: { id } });

  if (!asset) {
    throw new NotFoundError("Asset not found");
  }

  const findingRows = await prisma.finding.findMany({ where: { assetId: id } });
  const snapshotOrder = await loadSnapshotOrder(asset.constraintSetId);
  const findings = sortFindingsBySnapshotOrder(
    await Promise.all(
      findingRows.map((row) => toFindingDTO(row, asset.constraintSetId)),
    ),
    snapshotOrder,
  );
  const status = foldStatus(findings.map(toFoldFinding));
  const exceptions = buildExceptions(findings);

  let lineage = null;
  if (asset.regeneratedFromId) {
    const parent = await prisma.asset.findUnique({
      where: { id: asset.regeneratedFromId },
    });

    if (parent) {
      const parentFindingRows = await prisma.finding.findMany({
        where: { assetId: parent.id },
      });
      const parentFindings = await Promise.all(
        parentFindingRows.map((row) => toFindingDTO(row, parent.constraintSetId)),
      );

      lineage = buildLineage(
        asset.regeneratedFromId,
        parent.generationIndex,
        parentFindings,
      );
    }
  }

  return {
    id: asset.id,
    campaignId: asset.campaignId,
    channel: asset.channel as AssetDetailDTO["channel"],
    constraintSetId: asset.constraintSetId,
    headline: asset.headline,
    body: asset.body,
    disclaimer: asset.disclaimer,
    cta: asset.cta,
    canonicalText: asset.canonicalText,
    fieldOffsets: parseFieldOffsets(asset.fieldOffsets),
    runHash: asset.runHash,
    rulesetHash: asset.rulesetHash,
    generatedAt: asset.generatedAt.toISOString(),
    regeneratedFromId: asset.regeneratedFromId,
    generationIndex: asset.generationIndex,
    status,
    findings,
    exceptions,
    lineage,
  };
}
