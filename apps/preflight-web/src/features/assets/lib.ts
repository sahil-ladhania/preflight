/**
 * lib — assets-only helpers.
 * Why: shortId 8-char truncate and co-located helpers.
 */

import type { AssetStatus, FindingDTO, HumanVerdict } from "@preflight/schemas";

const ACCEPT_DISABLED: Partial<Record<AssetStatus, string>> = {
  blocked: "Deterministic blocker still open.",
  needs_human: "Review not finished.",
  needs_regen: "Regenerate this asset to ship.",
};

export function shortId(id: string): string {
  return id.slice(0, 8);
}

export function formatGeneratedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function acceptDisabledCaption(
  status: AssetStatus,
  findingsCount: number,
): string | null {
  if (findingsCount === 0) {
    return "Empty constraint set — not a proof.";
  }
  if (status === "clear" || status === "cleared_with_exception") {
    return null;
  }
  return ACCEPT_DISABLED[status] ?? null;
}

export function acceptIsEnabled(status: AssetStatus): boolean {
  return status === "clear" || status === "cleared_with_exception";
}

export function countPending(findings: FindingDTO[]): number {
  return findings.filter((f) => f.evaluationStatus === "pending").length;
}

export function findingById(
  findings: FindingDTO[],
  findingId: string,
): FindingDTO | undefined {
  return findings.find((f) => f.id === findingId);
}

export function humanVerdictLabel(verdict: HumanVerdict): string {
  const labels: Record<HumanVerdict, string> = {
    confirmed: "Confirmed",
    overridden: "Overridden",
    waived: "Waived",
  };
  return labels[verdict];
}

export function isFailFinding(finding: FindingDTO): boolean {
  return (
    finding.evaluationStatus === "complete" && finding.machineVerdict === "fail"
  );
}

export function scrollFindingTarget(
  findingId: string,
  target: "span" | "row",
): void {
  const attribute =
    target === "span" ? "data-finding-span" : "data-finding-row";
  document
    .querySelector(`[${attribute}="${findingId}"]`)
    ?.scrollIntoView({ block: "nearest" });
}
