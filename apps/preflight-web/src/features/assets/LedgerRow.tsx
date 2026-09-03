/**
 * LedgerRow — one collapsed/expanded ledger check row.
 * Why: grid-aligned row extracted from LedgerPane for file size.
 */

import type { ReactElement } from "react";
import { Check, MinusCircle, X } from "lucide-react";

import type { FindingDTO, HumanVerdict } from "@preflight/schemas";

import { LedgerExpanded } from "@/features/assets/LedgerExpanded";
import { humanVerdictLabel, LEDGER_ROW_GRID } from "@/features/assets/lib";
import { PendingRing } from "@/features/assets/PendingRing";
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
    return <PendingRing active />;
  }
  if (finding.evaluationStatus === "unavailable") {
    return <MinusCircle className="size-3.5 shrink-0 text-fg-muted" aria-hidden />;
  }
  if (finding.machineVerdict === "fail") {
    return <X className="size-3.5 shrink-0 text-fail" aria-hidden />;
  }
  return <Check className="size-3.5 shrink-0 text-fg-muted" aria-hidden />;
}

export interface LedgerRowProps {
  finding: FindingDTO;
  openFindingId: string | null;
  onRowClick: (findingId: string) => void;
  onConfirm: (findingId: string) => void;
  onOverride: (findingId: string) => void;
  onWaive: (findingId: string) => void;
  onRetry: (findingId: string) => void;
}

export function LedgerRow({
  finding,
  openFindingId,
  onRowClick,
  onConfirm,
  onOverride,
  onWaive,
  onRetry,
}: LedgerRowProps): ReactElement {
  const isOpen = openFindingId === finding.id;
  const isFailSelected = isOpen && finding.machineVerdict === "fail";
  const isPassSelected = isOpen && finding.machineVerdict === "pass";
  const isFail =
    finding.evaluationStatus === "complete" && finding.machineVerdict === "fail";

  return (
    <div className="border-b border-border bg-surface">
      <button
        type="button"
        data-finding-row={finding.id}
        onClick={() => onRowClick(finding.id)}
        className={cn(
          LEDGER_ROW_GRID,
          "w-full px-3 py-2 text-left hover:bg-ground",
          isFailSelected && "ledger-row-selected-fail",
          isPassSelected && "ledger-row-selected-pass",
        )}
      >
        <span className="inline-flex size-7 items-center justify-center">
          <MachineIcon finding={finding} />
        </span>
        <span className="truncate text-mono text-fg-muted">{finding.ruleId}</span>
        <span className="min-w-0 truncate font-serif text-body text-fg" title={finding.frozenWording}>
          {finding.frozenWording}
        </span>
        <KindBadge kind={finding.kind} />
        <span
          className={cn(
            "text-caption",
            isFail ? "text-fail" : "text-fg-muted",
            finding.evaluationStatus === "pending" && "italic",
          )}
        >
          {machineLabel(finding)}
        </span>
        {finding.humanVerdict !== null ? (
          <HumanChip verdict={finding.humanVerdict} />
        ) : (
          <span />
        )}
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
