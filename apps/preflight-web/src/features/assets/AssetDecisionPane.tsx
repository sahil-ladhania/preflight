/**
 * AssetDecisionPane — Right column (Column 3: THE DECISION).
 * Why: driven procedure guiding compliance reviewer through findings (09 Screen 1 R4).
 */

import { useState, type ReactElement } from "react";

import type { AssetStatus, FindingDTO } from "@preflight/schemas";

import { LedgerHeader } from "@/features/assets/LedgerHeader";
import { LedgerRow } from "@/features/assets/LedgerRow";
import { NextActionBlock } from "@/features/assets/NextActionBlock";
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

  const navigateStepper = (direction: "next" | "prev"): void => {
    const nextId = adjacentOpenId(findings, openFindingId, direction);
    if (nextId !== null) {
      onRowClick(nextId);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-[34%] shrink-0 flex-col overflow-hidden bg-ground">
      {/* Sticky Procedure Header */}
      <div className="shrink-0">
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
      </div>

      {/* Scrollable Findings Procedure */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {findings.length === 0 ? (
          <p className="px-5 py-3 font-sans text-caption text-fg-muted">
            No rules in the pinned set.
          </p>
        ) : filter === "open" && rows.length === 0 ? (
          <p className="px-5 py-4 font-sans text-caption text-fg-muted">
            Nothing open. All {findings.length} rules resolved.
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
      </div>

      {/* Pinned next action block and termination line */}
      <div className="shrink-0 bg-ground">
        <NextActionBlock
          status={status}
          findings={findings}
          onAccept={onAccept}
          onRegenerate={onRegenerate}
          regenerateInFlight={regenerateInFlight}
        />

        {/* Page termination line per 08 §4.5 */}
        <div className="px-5 pt-2 pb-5">
          <div className="border-t border-fg pt-1.5">
            <p className="font-sans text-label-strong uppercase tracking-[0.06em] text-fg-muted text-[10px]">
              END OF LEDGER — {findings.length} RULES · {open.length} NEED YOU
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
