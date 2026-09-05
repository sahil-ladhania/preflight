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
import { rowLeftHue, wordingTone } from "@/features/assets/ledger-lib";
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
      <span className="shrink-0 font-sans font-semibold text-verdict-chip uppercase border border-decision text-decision px-[5px] py-px">
        Waived
      </span>
    );
  }

  return (
    <span className="shrink-0 font-sans font-semibold text-verdict-chip uppercase text-decision">
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
  const isPass =
    finding.machineVerdict === "pass" && finding.humanVerdict === null;
  const leftHue = isPass ? "border-l-0" : rowLeftHue(finding);

  return (
    <div className="border-b border-hairline bg-surface">
      <button
        type="button"
        data-finding-row={finding.id}
        onClick={() => onRowClick(finding.id)}
        className={cn(
          "flex w-full items-center gap-2.5 px-3.5 py-1.5 text-left font-sans font-normal hover:bg-hover cursor-pointer bg-surface",
          leftHue,
          isOpen && "font-medium",
        )}
      >
        <span className="inline-flex size-3 shrink-0 items-center justify-center">
          <MachineIcon finding={finding} />
        </span>
        <span className="min-w-[66px] shrink-0 font-mono text-mono-meta text-fg-muted">
          {finding.ruleId}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 font-serif text-serif-row leading-[1.3]",
            wordingTone(finding) === "muted" ? "text-fg-muted" : "text-fg",
          )}
          title={finding.frozenWording}
        >
          {finding.frozenWording}
        </span>
        <KindBadge kind={finding.kind} />
        <VerdictChip finding={finding} />
      </button>
      {isOpen ? (
        <LedgerExpanded
          finding={finding}
          isPassSelected={isPass}
          onConfirm={() => onConfirm(finding.id)}
          onOverride={() => onOverride(finding.id)}
          onWaive={() => onWaive(finding.id)}
          onRetry={() => onRetry(finding.id)}
        />
      ) : null}
    </div>
  );
}
