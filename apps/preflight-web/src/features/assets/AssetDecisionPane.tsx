/**
 * AssetDecisionPane — Right column (Column 3: THE DECISION).
 * Why: driven procedure guiding compliance reviewer through findings (09 Screen 1 R4).
 */

import { useState, type ReactElement } from "react";

import type { AssetStatus, FindingDTO } from "@preflight/schemas";

import { Button } from "@/components/ui/button";
import { LedgerHeader } from "@/features/assets/LedgerHeader";
import { LedgerRow } from "@/features/assets/LedgerRow";
import {
  acceptDisabledCaption,
  acceptIsEnabled,
} from "@/features/assets/lib";
import {
  adjacentOpenId,
  initialLedgerFilter,
  ledgerCountLine,
  openFindings,
  stepperIndexForId,
  stepperLabel,
  visibleFindings,
  type LedgerFilter,
} from "@/features/assets/ledger-lib";

export interface AssetDecisionPaneProps {
  findings: FindingDTO[];
  status: AssetStatus;
  openFindingId: string | null;
  onRowClick: (findingId: string) => void;
  onConfirm: (findingId: string) => void;
  onOverride: (findingId: string) => void;
  onWaive: (findingId: string) => void;
  onRetry: (findingId: string) => void;
  onAccept: () => void;
  onRegenerate: () => void;
  regenerateInFlight?: boolean;
}

export function AssetDecisionPane({
  findings,
  status,
  openFindingId,
  onRowClick,
  onConfirm,
  onOverride,
  onWaive,
  onRetry,
  onAccept,
  onRegenerate,
  regenerateInFlight = false,
}: AssetDecisionPaneProps): ReactElement {
  const [filter, setFilter] = useState<LedgerFilter>(() =>
    initialLedgerFilter(findings),
  );
  const open = openFindings(findings);
  const stepperIndex = stepperIndexForId(open, openFindingId);
  const rows = visibleFindings(findings, filter);
  const allResolved = open.length === 0;
  const acceptEnabled = acceptIsEnabled(status);
  const disabledReason = acceptDisabledCaption(status, findings);

  const navigateStepper = (direction: "next" | "prev"): void => {
    const nextId = adjacentOpenId(findings, openFindingId, direction);
    if (nextId !== null) {
      onRowClick(nextId);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-[420px] shrink-0 flex-col overflow-hidden bg-ground">
      {/* Sticky Procedure Header */}
      <LedgerHeader
        countLine={ledgerCountLine(findings)}
        filter={filter}
        onFilterChange={setFilter}
        stepperText={stepperLabel(open, stepperIndex)}
        showStepperChevrons={open.length > 0}
        canStepperPrev={stepperIndex > 0}
        canStepperNext={stepperIndex < open.length - 1}
        onStepperPrev={() => navigateStepper("prev")}
        onStepperNext={() => navigateStepper("next")}
      />

      {/* Scrollable Findings Procedure */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        {findings.length === 0 ? (
          <p className="px-5 py-3 font-sans text-caption text-fg-muted">
            No rules in the pinned set.
          </p>
        ) : (
          rows.map((finding) => (
            <LedgerRow
              key={finding.id}
              finding={finding}
              openFindingId={openFindingId}
              onRowClick={onRowClick}
              onConfirm={onConfirm}
              onOverride={onOverride}
              onWaive={onWaive}
              onRetry={onRetry}
            />
          ))
        )}

        {/* When every finding is resolved, surface the single next action */}
        {allResolved ? (
          <div className="m-5 flex flex-col gap-3 border border-hairline bg-surface p-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-wider text-decision">
              All rules resolved
            </p>
            <p className="font-sans text-caption text-fg-muted">
              Every pinned rule has been evaluated or carries a recorded human decision.
            </p>
            {acceptEnabled ? (
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  type="button"
                  className="h-8 rounded-none border border-fg bg-fg px-4 font-sans text-xs font-medium text-surface hover:opacity-90 cursor-pointer"
                  onClick={onAccept}
                >
                  Ready for compliance desk
                </Button>
                <p className="font-sans text-[11px] text-fg-muted">
                  Marks this asset ready for the compliance desk. Preflight does not publish.
                </p>
              </div>
            ) : status === "needs_regen" ? (
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  type="button"
                  className="h-8 rounded-none border border-fg bg-surface px-4 font-sans text-xs font-medium text-fg hover:bg-hover cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={regenerateInFlight}
                  onClick={onRegenerate}
                >
                  {regenerateInFlight ? "Regenerating…" : "Regenerate copy"}
                </Button>
                <p className="font-sans text-[11px] text-fg-muted">
                  A machine failure was confirmed. Regenerate to produce compliant copy.
                </p>
              </div>
            ) : disabledReason !== null ? (
              <p className="font-sans text-caption text-attention">
                {disabledReason}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* Page termination line per 08 §4.5 */}
        <div className="mt-auto px-5 pt-6 pb-5">
          <div className="border-t border-fg pt-2">
            <p className="font-sans text-label-strong uppercase tracking-[0.06em] text-fg-muted text-[10px]">
              Decisions · {findings.length} rules · {open.length === 0 ? "All resolved" : `${open.length} open`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
