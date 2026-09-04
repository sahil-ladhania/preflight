/**
 * LedgerRow — one collapsed/expanded ledger checklist row.
 * Why: checklist row extracted from LedgerPane for file size.
 */

import type { ReactElement } from "react";
import { Check, MinusCircle, X } from "lucide-react";

import type { FindingDTO } from "@preflight/schemas";

import { Badge } from "@/components/ui/badge";
import { LedgerExpanded } from "@/features/assets/LedgerExpanded";
import { humanVerdictLabel } from "@/features/assets/lib";
import { wordingTone } from "@/features/assets/ledger-lib";
import { PendingRing } from "@/features/assets/PendingRing";
import { cn } from "@/lib/utils";

function KindBadge({ kind }: { kind: FindingDTO["kind"] }): ReactElement {
  return (
    <Badge
      variant="outline"
      className="shrink-0 rounded-none border-hairline px-[5px] py-0 font-mono text-kind-badge uppercase text-fg-muted font-normal"
    >
      {kind === "deterministic" ? "DET" : "JDG"}
    </Badge>
  );
}

function VerdictChip({ finding }: { finding: FindingDTO }): ReactElement | null {
  if (finding.humanVerdict === null) {
    return null;
  }

  if (finding.humanVerdict === "waived") {
    return (
      <span className="shrink-0 font-sans font-semibold text-verdict-chip uppercase chip-waived">
        Waived
      </span>
    );
  }

  const chipClass =
    finding.humanVerdict === "confirmed" ? "human-confirmed" : "human-overridden";

  return (
    <span
      className={cn(
        "shrink-0 font-sans font-semibold text-verdict-chip uppercase",
        chipClass,
      )}
    >
      {humanVerdictLabel(finding.humanVerdict)}
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
          "flex w-full items-center px-4 py-2 text-left font-sans font-normal transition-colors hover:bg-primary-wash/30",
          isOpen && "border-l-2 border-l-primary bg-primary-wash/40 font-medium",
        )}
      >
        <span className="flex min-w-0 max-w-[640px] items-center gap-2">
          <span className="inline-flex size-3 shrink-0 items-center justify-center">
            <MachineIcon finding={finding} />
          </span>
          <span className="min-w-[58px] shrink-0 font-mono text-[11px] text-fg-muted">
            {finding.ruleId}
          </span>
          <span
            className={cn(
              "min-w-0 truncate font-sans text-xs",
              wordingTone(finding) === "muted" ? "text-fg-muted" : "text-fg",
            )}
            title={finding.frozenWording}
          >
            {finding.frozenWording}
          </span>
          <KindBadge kind={finding.kind} />
          <VerdictChip finding={finding} />
        </span>
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
