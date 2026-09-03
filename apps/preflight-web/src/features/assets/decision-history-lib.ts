/**
 * decision-history-lib — decision history modal presentation helpers.
 * Why: sort, labels, and footer copy for read-only audit trail (09 R4).
 */

import type { DecisionAction, FindingDecisionDTO } from "@preflight/schemas";

import { formatGeneratedAt, humanVerdictLabel } from "@/features/assets/lib";

const ACTION_LABELS: Record<DecisionAction, string> = {
  waive: "Waived",
  confirm: "Confirmed",
  override: "Overridden",
  retry: "Retry requested",
};

export function showDecisionHistoryLink(
  decisions: FindingDecisionDTO[],
): boolean {
  return decisions.length > 1;
}

export function decisionsNewestFirst(
  decisions: FindingDecisionDTO[],
): FindingDecisionDTO[] {
  return [...decisions].sort(
    (left, right) => new Date(right.at).getTime() - new Date(left.at).getTime(),
  );
}

export function decisionVerdictLabel(row: FindingDecisionDTO): string {
  if (row.verdict !== null) {
    return humanVerdictLabel(row.verdict);
  }
  return ACTION_LABELS[row.action];
}

export function decisionTransitionLabel(
  row: FindingDecisionDTO,
): string | null {
  if (row.previousVerdict === null || row.verdict === null) {
    return null;
  }
  if (row.previousVerdict === row.verdict) {
    return null;
  }
  return `${humanVerdictLabel(row.previousVerdict)} → ${humanVerdictLabel(row.verdict)}`;
}

export function decisionHistoryFooterLine(
  decisions: FindingDecisionDTO[],
): string {
  const sorted = decisionsNewestFirst(decisions);
  const oldest = [...decisions].sort(
    (left, right) => new Date(left.at).getTime() - new Date(right.at).getTime(),
  )[0];
  const inForce = sorted[0];
  const firstDate =
    oldest !== undefined ? formatGeneratedAt(oldest.at) : "unknown";
  const inForceLabel =
    inForce !== undefined ? decisionVerdictLabel(inForce) : "unknown";

  return `${decisions.length} decisions · first ${firstDate} · in force: ${inForceLabel}`;
}
