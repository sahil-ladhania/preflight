/**
 * assets-derive — statusDetail, exceptions, lineage derivation.
 * Why: keep assets.service under 200 lines (14-backend-design.md Area 3).
 */
import type {
  AssetStatus,
  ExceptionItemDTO,
  FindingDTO,
  LineageDTO,
} from "@preflight/schemas";
import { foldStatus } from "@preflight/schemas";

export interface FindingStatusInput {
  ruleId: string;
  kind: FindingDTO["kind"];
  evaluationStatus: FindingDTO["evaluationStatus"];
  machineVerdict: FindingDTO["machineVerdict"];
  humanVerdict: FindingDTO["humanVerdict"];
}

function formatRuleIds(ruleIds: string[]): string {
  if (ruleIds.length === 0) {
    return "";
  }

  if (ruleIds.length <= 3) {
    return ruleIds.join(", ");
  }

  return `${ruleIds.slice(0, 3).join(", ")} +${ruleIds.length - 3} more`;
}

export function buildStatusDetail(
  findings: FindingStatusInput[],
  status: AssetStatus,
  pendingCount: number,
): string {
  if (status === "blocked") {
    const ruleIds = findings
      .filter(
        (finding) =>
          finding.kind === "deterministic" &&
          finding.machineVerdict === "fail" &&
          finding.humanVerdict !== "waived",
      )
      .map((finding) => finding.ruleId);

    return `Fails ${formatRuleIds(ruleIds)} — must be fixed or waived`;
  }

  if (status === "needs_human" && pendingCount > 0) {
    return `Checking ${pendingCount} rules…`;
  }

  if (status === "needs_human") {
    const unavailableIds = findings
      .filter((finding) => finding.evaluationStatus === "unavailable")
      .map((finding) => finding.ruleId);

    if (unavailableIds.length > 0) {
      return `${formatRuleIds(unavailableIds)} could not be evaluated — retry`;
    }

    const ruleIds = findings
      .filter(
        (finding) =>
          finding.kind === "judgement" &&
          finding.machineVerdict === "fail" &&
          finding.humanVerdict === null,
      )
      .map((finding) => finding.ruleId);

    return `${formatRuleIds(ruleIds)} needs your decision`;
  }

  if (status === "needs_regen") {
    const ruleIds = findings
      .filter(
        (finding) =>
          finding.kind === "judgement" &&
          finding.machineVerdict === "fail" &&
          finding.humanVerdict === "confirmed",
      )
      .map((finding) => finding.ruleId);

    return `You confirmed ${formatRuleIds(ruleIds)} — needs regenerating`;
  }

  if (status === "cleared_with_exception") {
    const count = findings.filter((finding) => finding.humanVerdict === "waived").length;
    return count === 1
      ? "Ships with 1 waived exception"
      : `Ships with ${count} waived exceptions`;
  }

  return "Ready to ship";
}

export function buildExceptions(findings: FindingDTO[]): ExceptionItemDTO[] {
  return findings
    .filter((finding) => finding.humanVerdict === "waived")
    .map((finding) => ({
      findingId: finding.id,
      ruleId: finding.ruleId,
      frozenWording: finding.frozenWording,
      humanReason: finding.humanReason ?? "",
      humanActor: finding.humanActor ?? "",
      humanAt: finding.humanAt ?? new Date(0).toISOString(),
    }));
}

export function buildLineage(
  regeneratedFromId: string,
  parentGenerationIndex: number,
  parentFindings: FindingDTO[],
): LineageDTO {
  const parentStatus = foldStatus(
    parentFindings.map((finding) => ({
      kind: finding.kind,
      evaluationStatus: finding.evaluationStatus,
      machineVerdict: finding.machineVerdict,
      humanVerdict: finding.humanVerdict,
    })),
  );

  let ruleIds: string[] = [];

  if (parentStatus === "needs_regen") {
    ruleIds = parentFindings
      .filter(
        (finding) =>
          finding.kind === "judgement" &&
          finding.machineVerdict === "fail" &&
          finding.humanVerdict === "confirmed",
      )
      .map((finding) => finding.ruleId);
  } else if (
    parentFindings.some(
      (finding) =>
        finding.kind === "deterministic" &&
        finding.machineVerdict === "fail" &&
        finding.humanVerdict !== "waived",
    )
  ) {
    ruleIds = parentFindings
      .filter(
        (finding) =>
          finding.kind === "deterministic" &&
          finding.machineVerdict === "fail" &&
          finding.humanVerdict !== "waived",
      )
      .map((finding) => finding.ruleId);
  } else {
    ruleIds = parentFindings
      .filter(
        (finding) =>
          finding.evaluationStatus === "unavailable" ||
          (finding.kind === "judgement" &&
            finding.machineVerdict === "fail" &&
            finding.humanVerdict === null),
      )
      .map((finding) =>
        finding.evaluationStatus === "unavailable" ? "unavailable" : finding.ruleId,
      );
  }

  return {
    parentId: regeneratedFromId,
    parentGenerationIndex,
    parentStatus,
    ruleIds,
  };
}

export function countPending(findings: FindingDTO[]): number {
  return findings.filter((finding) => finding.evaluationStatus === "pending").length;
}

export function campaignNameFromBrief(structuredBrief: unknown): string {
  if (structuredBrief === null || structuredBrief === undefined) {
    return "";
  }
  if (typeof structuredBrief !== "object") {
    return "";
  }
  const schemeName = (structuredBrief as { schemeName?: unknown }).schemeName;
  if (typeof schemeName !== "string") {
    return "";
  }
  return schemeName.trim();
}

export function sortFindingsBySnapshotOrder(
  findings: FindingDTO[],
  snapshotOrder: string[],
): FindingDTO[] {
  const order = new Map(snapshotOrder.map((ruleId, index) => [ruleId, index]));

  return [...findings].sort((left, right) => {
    const leftIndex = order.get(left.ruleId) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = order.get(right.ruleId) ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });
}
