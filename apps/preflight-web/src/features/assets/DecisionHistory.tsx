/**
 * DecisionHistory — collapsible human decision audit trail.
 * Why: G-02 governance on expanded ledger row (doc 21).
 */

import { useState, type ReactElement } from "react";

import type { DecisionAction, FindingDecisionDTO, HumanVerdict } from "@preflight/schemas";

import { formatGeneratedAt, humanVerdictLabel } from "@/features/assets/lib";

interface DecisionHistoryProps {
  decisions: FindingDecisionDTO[];
}

const ACTION_LABELS: Record<DecisionAction, string> = {
  waive: "Waived",
  confirm: "Confirmed",
  override: "Overridden",
  retry: "Retry requested",
};

function previousLabel(verdict: HumanVerdict): string {
  return humanVerdictLabel(verdict).toLowerCase();
}

function formatDecisionLine(row: FindingDecisionDTO): string {
  const parts = [
    ACTION_LABELS[row.action],
    row.actor,
    formatGeneratedAt(row.at),
  ];

  if (row.reason !== null && row.reason.length > 0) {
    parts.push(`"${row.reason}"`);
  }

  if (row.previousVerdict !== null) {
    parts.push(`(was: ${previousLabel(row.previousVerdict)})`);
  }

  return parts.join(" · ");
}

export function DecisionHistory({ decisions }: DecisionHistoryProps): ReactElement | null {
  const [open, setOpen] = useState<boolean>(false);

  if (decisions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="w-fit text-caption text-fg-muted underline-offset-2 hover:underline"
        onClick={() => setOpen((value) => !value)}
      >
        Decision history ({decisions.length})
      </button>
      {open ? (
        <ul className="flex flex-col gap-1">
          {decisions.map((row) => (
            <li key={row.id} className="text-caption text-fg-muted">
              {formatDecisionLine(row)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
