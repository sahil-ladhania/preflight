/**
 * LedgerPane — R4 ledger header and checks list.
 * Why: right pane chrome and grid-aligned collapsed rows.
 */

import type { ReactElement } from "react";

import { countPending, LEDGER_ROW_GRID } from "@/features/assets/lib";
import { LedgerRow } from "@/features/assets/LedgerRow";
import type { LedgerPaneProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

function ColumnHeader(): ReactElement {
  return (
    <div
      className={cn(
        "sticky top-0 z-10",
        LEDGER_ROW_GRID,
        "border-b border-border bg-canvas-subtle px-3 py-2",
      )}
    >
      <span aria-hidden />
      <span className="text-caption text-fg-muted">Rule</span>
      <span className="text-caption text-fg-muted">Wording</span>
      <span className="text-caption text-fg-muted">Kind</span>
      <span className="text-caption text-fg-muted">Result</span>
      <span aria-hidden />
    </div>
  );
}

export function LedgerPane({
  findings,
  openFindingId,
  onRowClick,
  onConfirm,
  onOverride,
  onWaive,
  onRetry,
}: LedgerPaneProps): ReactElement {
  const pendingCount = countPending(findings);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto rounded-md border border-border bg-canvas-subtle">
      <div className="border-b border-border px-4 py-2">
        <p className="text-caption text-fg-muted">{findings.length} rules</p>
        {pendingCount > 0 ? (
          <p className="text-caption text-fg-muted">
            Evaluating {pendingCount} rules…
          </p>
        ) : null}
      </div>
      {findings.length === 0 ? (
        <p className="px-4 py-3 text-caption text-fg-muted">
          No rules in the pinned set.
        </p>
      ) : (
        <>
          <ColumnHeader />
          {findings.map((finding) => (
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
          ))}
        </>
      )}
    </div>
  );
}
