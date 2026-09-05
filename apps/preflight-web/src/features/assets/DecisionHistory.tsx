/**
 * DecisionHistory — link to read-only decision audit trail modal.
 * Why: ledger row shows link only when n > 1 (09 R4).
 */

import { useState, type ReactElement } from "react";
import { History } from "lucide-react";

import { DecisionHistoryModal } from "@/features/assets/DecisionHistoryModal";
import { showDecisionHistoryLink } from "@/features/assets/decision-history-lib";
import type { FindingDTO } from "@preflight/schemas";

interface DecisionHistoryProps {
  finding: FindingDTO;
}

export function DecisionHistory({ finding }: DecisionHistoryProps): ReactElement | null {
  const [open, setOpen] = useState<boolean>(false);

  if (!showDecisionHistoryLink(finding.decisions)) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="mt-3.5 inline-flex cursor-pointer items-center gap-1.5 font-sans text-caption font-normal text-fg-muted underline underline-offset-4"
        onClick={() => setOpen(true)}
      >
        <History className="size-3.5 shrink-0" aria-hidden />
        Decision history ({finding.decisions.length})
      </button>
      <DecisionHistoryModal
        finding={finding}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
