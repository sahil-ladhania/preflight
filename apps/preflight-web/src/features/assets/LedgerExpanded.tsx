/**
 * LedgerExpanded — R4c open finding with machine/human blocks.
 * Why: one expanded ledger row at a time (08 §5.7).
 */

import type { ReactElement } from "react";

import type { FindingDTO } from "@preflight/schemas";

import { DecisionHistory } from "@/features/assets/DecisionHistory";
import {
  formatGeneratedAt,
  humanVerdictLabel,
} from "@/features/assets/lib";
import type { LedgerExpandedProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

const UNAVAILABLE_COPY =
  "Evaluation unavailable — span not found in asset. Deterministic results unaffected.";

function MachineSpanQuote({ finding }: { finding: FindingDTO }): ReactElement {
  if (finding.evaluationStatus === "pending") {
    return (
      <p className="font-sans text-caption text-fg-muted">
        Evaluation in progress.
      </p>
    );
  }

  if (finding.evaluationStatus === "unavailable") {
    if (finding.machineReason !== null) {
      return (
        <p className="font-sans text-caption text-attention">
          {finding.machineReason}
        </p>
      );
    }
    return (
      <p className="font-sans text-caption text-attention">{UNAVAILABLE_COPY}</p>
    );
  }

  if (finding.spans.length === 0) {
    return (
      <p className="font-sans text-caption text-fg-muted">
        No matching span — absence rule.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {finding.spans.map((span) => (
        <p
          key={`${span.start}-${span.end}`}
          className="border-l-2 border-fail py-0 pl-2.5 font-mono text-mono-meta text-fg"
        >
          {span.text}
        </p>
      ))}
    </div>
  );
}

function DecisionButtons({
  finding,
  onConfirm,
  onOverride,
  onWaive,
  onRetry,
}: LedgerExpandedProps): ReactElement | null {
  if (finding.machineVerdict === "pass") {
    return null;
  }
  if (finding.evaluationStatus === "pending") {
    return null;
  }
  if (finding.evaluationStatus === "unavailable") {
    return (
      <button
        type="button"
        className="inline-flex h-7 cursor-pointer items-center justify-center border border-fg px-3 font-sans text-button-sm font-normal text-fg"
        onClick={onRetry}
      >
        Retry
      </button>
    );
  }
  if (finding.machineVerdict === "fail" && finding.kind === "deterministic") {
    return (
      <button
        type="button"
        className="inline-flex h-7 cursor-pointer items-center justify-center border border-decision px-3 font-sans text-button-sm font-medium text-decision"
        onClick={onWaive}
      >
        Waive
      </button>
    );
  }
  if (finding.machineVerdict === "fail" && finding.kind === "judgement") {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex h-7 cursor-pointer items-center justify-center border border-fg px-3 font-sans text-button-sm font-medium text-fg"
          onClick={onConfirm}
        >
          Confirm
        </button>
        <button
          type="button"
          className="inline-flex h-7 cursor-pointer items-center justify-center border border-fg px-3 font-sans text-button-sm font-medium text-fg"
          onClick={onOverride}
        >
          Override
        </button>
        <button
          type="button"
          className="inline-flex h-7 cursor-pointer items-center justify-center border border-decision px-3 font-sans text-button-sm font-medium text-decision"
          onClick={onWaive}
        >
          Waive
        </button>
      </div>
    );
  }
  return null;
}

function HumanDecisionBlock({
  finding,
  actions,
}: {
  finding: FindingDTO;
  actions: ReactElement | null;
}): ReactElement | null {
  if (finding.humanVerdict !== null) {
    const line =
      finding.humanActor !== null && finding.humanAt !== null
        ? `${humanVerdictLabel(finding.humanVerdict)} · ${finding.humanActor} · ${formatGeneratedAt(finding.humanAt)}`
        : humanVerdictLabel(finding.humanVerdict);

    return (
      <div className="flex flex-col gap-1 border border-decision bg-decision-wash px-3 py-2.5">
        <p className="text-micro uppercase text-decision">Human decision</p>
        <p className="font-sans text-caption text-fg">{line}</p>
        {finding.humanReason !== null && finding.humanReason.length > 0 ? (
          <p className="font-serif text-copy italic text-fg">
            &ldquo;{finding.humanReason}&rdquo;
          </p>
        ) : null}
      </div>
    );
  }

  if (actions === null) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 border border-dashed border-hairline px-3 py-2.5">
      <p className="text-micro uppercase text-decision">
        Human decision — required
      </p>
      {actions}
    </div>
  );
}

export function LedgerExpanded(props: LedgerExpandedProps): ReactElement {
  const { finding } = props;
  const showMachineReason =
    finding.evaluationStatus === "complete" && finding.machineReason !== null;
  const reasonClass =
    finding.evaluationStatus === "unavailable"
      ? "font-sans text-caption text-attention"
      : "font-sans text-caption text-fg";
  const actions = <DecisionButtons {...props} />;

  return (
    <div className="flex flex-col gap-3 border-t border-hairline bg-surface px-5 pb-[18px]">
      <div className="flex flex-col gap-2 pt-3.5">
        <p className="text-micro uppercase text-fg-muted">Machine finding</p>
        <MachineSpanQuote finding={finding} />
        {showMachineReason && finding.machineReason !== null ? (
          <p className={cn(reasonClass)}>{finding.machineReason}</p>
        ) : null}
      </div>
      <HumanDecisionBlock finding={finding} actions={actions} />
      <DecisionHistory decisions={finding.decisions} />
    </div>
  );
}
