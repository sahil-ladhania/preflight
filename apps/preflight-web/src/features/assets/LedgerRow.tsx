/**
 * LedgerRow — one collapsed/expanded ledger checklist row.
 * Why: checklist row extracted from LedgerPane for file size.
 */

import type { ReactElement } from "react";
import { Check, MinusCircle, X } from "lucide-react";

import type { FindingDTO } from "@preflight/schemas";

import { LedgerExpanded } from "@/features/assets/LedgerExpanded";
import { PendingRing } from "@/features/assets/PendingRing";
import { cn } from "@/lib/utils";

function KindBadge({ kind }: { kind: FindingDTO["kind"] }): ReactElement {
  return (
    <span className="border border-hairline px-[5px] py-0 font-mono text-kind-badge uppercase text-fg-muted">
      {kind === "deterministic" ? "DET" : "JDG"}
    </span>
  );
}

function MachineIcon({ finding }: { finding: FindingDTO }): ReactElement {
  if (finding.evaluationStatus === "pending") {
    return <PendingRing active />;
  }
  if (finding.evaluationStatus === "unavailable") {
    return (
      <MinusCircle
        className="size-3 shrink-0 text-attention"
        strokeWidth={2}
        aria-hidden
      />
    );
  }
  if (finding.machineVerdict === "fail") {
    return (
      <X className="size-3 shrink-0 text-fail" strokeWidth={2} aria-hidden />
    );
  }
  return (
    <Check className="size-3 shrink-0 text-pass" strokeWidth={2} aria-hidden />
  );
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

  return (
    <div className="border-b border-hairline">
      <button
        type="button"
        data-finding-row={finding.id}
        onClick={() => onRowClick(finding.id)}
        className={cn(
          "flex w-full items-center gap-2.5 px-5 py-2.5 text-left hover:bg-hover",
          isOpen && "bg-surface",
        )}
      >
        <span className="inline-flex size-3 shrink-0 items-center justify-center">
          <MachineIcon finding={finding} />
        </span>
        <span className="min-w-[66px] shrink-0 font-mono text-mono-meta text-fg-muted">
          {finding.ruleId}
        </span>
        <span
          className="min-w-0 flex-1 truncate font-sans text-ui text-fg"
          title={finding.frozenWording}
        >
          {finding.frozenWording}
        </span>
        <KindBadge kind={finding.kind} />
        {finding.humanVerdict === "waived" ? (
          <span className="text-verdict-chip uppercase chip-waived">Waived</span>
        ) : null}
      </button>
      {isOpen ? (
        <LedgerExpanded
          finding={finding}
          isPassSelected={finding.machineVerdict === "pass"}
          onConfirm={() => onConfirm(finding.id)}
          onOverride={() => onOverride(finding.id)}
          onWaive={() => onWaive(finding.id)}
          onRetry={() => onRetry(finding.id)}
        />
      ) : null}
    </div>
  );
}
