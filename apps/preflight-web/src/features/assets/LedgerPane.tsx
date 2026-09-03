/**
 * LedgerPane — R4 ledger header and checklist rows.
 * Why: right pane chrome and finding list per 09 R4.
 */

import { useState, type ReactElement } from "react";

import { AssetActionRow } from "@/features/assets/AssetActionRow";
import { LedgerHeader } from "@/features/assets/LedgerHeader";
import { LedgerRow } from "@/features/assets/LedgerRow";
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
import type { LedgerPaneProps } from "@/features/assets/types";

export function LedgerPane({
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
  onExport,
  exportInFlight = false,
  regenerateInFlight = false,
}: LedgerPaneProps): ReactElement {
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-ground">
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
      <div className="min-h-0 flex-1 overflow-y-auto">
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
      </div>
      <footer className="shrink-0 border-t border-fg bg-ground px-5 py-4">
        <div className="max-w-[640px]">
          <AssetActionRow
            status={status}
            findings={findings}
            onAccept={onAccept}
            onRegenerate={onRegenerate}
            onExport={onExport}
            exportInFlight={exportInFlight}
            regenerateInFlight={regenerateInFlight}
          />
        </div>
      </footer>
    </div>
  );
}
