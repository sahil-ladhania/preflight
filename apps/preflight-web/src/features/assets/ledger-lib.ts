/**
 * ledger-lib — Screen 1 ledger presentation helpers.
 * Why: filter, counts, and stepper share one open-finding predicate (09 R4a).
 */

import type { FindingDTO } from "@preflight/schemas";

import { countPending, verdictCounts } from "@/features/assets/lib";

export type LedgerFilter = "all" | "open";

export function isOpenFinding(finding: FindingDTO): boolean {
  if (finding.humanVerdict !== null) {
    return false;
  }
  if (finding.evaluationStatus === "pending") {
    return true;
  }
  if (finding.evaluationStatus === "unavailable") {
    return true;
  }
  return (
    finding.evaluationStatus === "complete" && finding.machineVerdict === "fail"
  );
}

export function openFindings(findings: FindingDTO[]): FindingDTO[] {
  return findings.filter(isOpenFinding);
}

export function ledgerCountLine(findings: FindingDTO[]): string {
  const { passed, needsYou } = verdictCounts(findings);
  const pending = countPending(findings);

  let line =
    needsYou === 0
      ? `All ${passed} rules resolved`
      : `${passed} passed · ${needsYou} need you`;

  if (pending > 0) {
    line = `${line} Evaluating ${pending} rules…`;
  }

  return line;
}

export function stepperLabel(open: FindingDTO[], index: number): string {
  if (open.length === 0) {
    return "All rules resolved";
  }
  return `Finding ${index + 1} of ${open.length}`;
}

export function stepperIndexForId(
  open: FindingDTO[],
  findingId: string | null,
): number {
  if (findingId === null || open.length === 0) {
    return 0;
  }
  const index = open.findIndex((finding) => finding.id === findingId);
  return index >= 0 ? index : 0;
}

export function adjacentOpenId(
  findings: FindingDTO[],
  currentId: string | null,
  direction: "next" | "prev",
): string | null {
  const open = openFindings(findings);
  if (open.length === 0) {
    return null;
  }

  const currentIndex = stepperIndexForId(open, currentId);
  const nextIndex =
    direction === "next" ? currentIndex + 1 : currentIndex - 1;

  if (nextIndex < 0 || nextIndex >= open.length) {
    return null;
  }

  return open[nextIndex]?.id ?? null;
}

export function visibleFindings(
  findings: FindingDTO[],
  filter: LedgerFilter,
): FindingDTO[] {
  if (filter === "open") {
    return openFindings(findings);
  }
  return findings;
}
