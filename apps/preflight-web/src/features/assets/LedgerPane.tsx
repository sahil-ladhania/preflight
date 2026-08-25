/**
 * LedgerPane — R4 ledger header and checks list.
 * Why: right pane chrome and collapsed rows.
 */

import type { ReactElement } from "react";
import {
  Check,
  Loader2,
  MinusCircle,
  X,
} from "lucide-react";

import type { FindingDTO, HumanVerdict } from "@preflight/schemas";

import type { LedgerPaneProps } from "@/features/assets/types";
import { countPending, humanVerdictLabel } from "@/features/assets/lib";
import { LedgerExpanded } from "@/features/assets/LedgerExpanded";
import { cn } from "@/lib/utils";

function KindBadge({ kind }: { kind: FindingDTO["kind"] }): ReactElement {
  return (
    <span className="rounded-md border border-border px-1.5 py-0 text-kind text-fg-muted">
      {kind === "deterministic" ? "det" : "jdg"}
    </span>
  );
}

function HumanChip({ verdict }: { verdict: HumanVerdict }): ReactElement {
  const className =
    verdict === "confirmed"
      ? "human-confirmed"
      : verdict === "overridden"
        ? "human-overridden"
        : "human-waived";

  return (
    <span className={cn("text-chip", className)}>
      {humanVerdictLabel(verdict)}
    </span>
  );
}

function machineLabel(finding: FindingDTO): string {
  if (finding.evaluationStatus === "pending") {
    return "Pending";
  }
  if (finding.evaluationStatus === "unavailable") {
    return "Unavailable";
  }
  return finding.machineVerdict === "fail" ? "Fail" : "Pass";
}

function MachineIcon({ finding }: { finding: FindingDTO }): ReactElement {
  if (finding.evaluationStatus === "pending") {
    return <Loader2 className="size-3 shrink-0 animate-spin text-fg-muted" aria-hidden />;
  }
  if (finding.evaluationStatus === "unavailable") {
    return <MinusCircle className="size-3 shrink-0 text-fg-muted" aria-hidden />;
  }
  if (finding.machineVerdict === "fail") {
    return <X className="size-3 shrink-0 text-fail" aria-hidden />;
  }
  return <Check className="size-3 shrink-0 text-fg-muted" aria-hidden />;
}

function LedgerRow({
  finding,
  openFindingId,
  onRowClick,
  onConfirm,
  onOverride,
  onWaive,
  onRetry,
}: {
  finding: FindingDTO;
  openFindingId: string | null;
  onRowClick: (findingId: string) => void;
  onConfirm: (findingId: string) => void;
  onOverride: (findingId: string) => void;
  onWaive: (findingId: string) => void;
  onRetry: (findingId: string) => void;
}): ReactElement {
  const isOpen = openFindingId === finding.id;
  const isFailSelected = isOpen && finding.machineVerdict === "fail";
  const isPassSelected = isOpen && finding.machineVerdict === "pass";

  return (
    <div className="border-b border-border bg-canvas">
      <button
        type="button"
        data-finding-row={finding.id}
        onClick={() => onRowClick(finding.id)}
        className={cn(
          "flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-canvas-subtle",
          isFailSelected && "ledger-row-selected-fail",
          isPassSelected && "ledger-row-selected-pass",
        )}
      >
        <MachineIcon finding={finding} />
        <span className="text-mono text-fg-muted">{finding.ruleId}</span>
        <span className="min-w-0 flex-1 truncate text-body text-fg">
          {finding.frozenWording}
        </span>
        <KindBadge kind={finding.kind} />
        <span
          className={cn(
            "text-caption text-fg-muted",
            finding.evaluationStatus === "pending" && "italic",
          )}
        >
          {machineLabel(finding)}
        </span>
        {finding.humanVerdict !== null ? (
          <HumanChip verdict={finding.humanVerdict} />
        ) : null}
      </button>
      {isOpen ? (
        <LedgerExpanded
          finding={finding}
          isPassSelected={isPassSelected}
          onConfirm={() => onConfirm(finding.id)}
          onOverride={() => onOverride(finding.id)}
          onWaive={() => onWaive(finding.id)}
          onRetry={() => onRetry(finding.id)}
        />
      ) : null}
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
        findings.map((finding) => (
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
  );
}
