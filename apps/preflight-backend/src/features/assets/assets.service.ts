/**
 * assets.service — Assets list and detail DTOs.
 * Why: foldStatus; lineage + exceptions derivation.
 */
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
  countPending,
  sortFindingsBySnapshotOrder,
} from "./assets-derive.js";
import {
  toFindingDTO,
  toFoldFinding,
  toIso,
} from "../findings/finding-dto.js";
import { NotFoundError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

function parseFieldOffsets(value: unknown): FieldOffsets {
  return value as FieldOffsets;
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

async function mapAssetListItem(asset: {
  id: string;
  channel: string;
  headline: string;
  constraintSetId: string;
  generationIndex: number;
  regeneratedFromId: string | null;
  generatedAt: Date;
}): Promise<AssetListItemDTO> {
  const findingRows = await prisma.finding.findMany({
    where: { assetId: asset.id },
  });
  const findings = await Promise.all(
    findingRows.map((row) => toFindingDTO(row, asset.constraintSetId)),
  );
  const status = foldStatus(findings.map(toFoldFinding));
  const pendingCount = countPending(findings);

  return {
    id: asset.id,
    channel: asset.channel as AssetListItemDTO["channel"],
    headline: asset.headline,
    status,
    generationIndex: asset.generationIndex,
    regeneratedFromId: asset.regeneratedFromId,
    generatedAt: toIso(asset.generatedAt),
    pendingCount,
    statusDetail: buildStatusDetail(findings, status, pendingCount),
  };
}

export async function listAssets(): Promise<AssetsListResponse> {
  const assets = await prisma.asset.findMany({
    orderBy: { generatedAt: "desc" },
    select: {
      id: true,
      channel: true,
      headline: true,
      constraintSetId: true,
      generationIndex: true,
      regeneratedFromId: true,
      generatedAt: true,
    },
  });

  const listItems = await Promise.all(assets.map((asset) => mapAssetListItem(asset)));
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
    generatedAt: toIso(asset.generatedAt),
    regeneratedFromId: asset.regeneratedFromId,
    generationIndex: asset.generationIndex,
    status,
    findings,
    exceptions,
    lineage,
  };
}
