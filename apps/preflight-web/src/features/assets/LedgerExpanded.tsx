/**
 * LedgerExpanded — R4c open finding with machine/human blocks.
 * Why: one expanded ledger row at a time (08 §5.7).
 */

import type { ReactElement } from "react";
import type { FindingDTO } from "@preflight/schemas";

import { DecisionButtons } from "@/features/assets/DecisionButtons";
import { DecisionHistory } from "@/features/assets/DecisionHistory";
import {
  formatGeneratedAt,
  humanVerdictLabel,
} from "@/features/assets/lib";
import type { LedgerExpandedProps } from "@/features/assets/types";
import { usePersona } from "@/features/shell/PersonaProvider";
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
    return (
      <p className="font-sans text-caption text-attention">
        {finding.machineReason ?? UNAVAILABLE_COPY}
      </p>
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

function HumanDecisionBlock({
  finding,
  actions,
}: {
  finding: FindingDTO;
  actions: ReactElement | null;
}): ReactElement | null {
  const { actor } = usePersona();

  if (finding.humanVerdict !== null) {
    const actorName =
      finding.humanActor === "Demo Operator" || !finding.humanActor
        ? (actor?.name ?? "Arjun Legha")
        : finding.humanActor;

    const line =
      finding.humanAt !== null
        ? `${humanVerdictLabel(finding.humanVerdict)} · ${actorName} · ${formatGeneratedAt(finding.humanAt)}`
        : humanVerdictLabel(finding.humanVerdict);

    return (
      <div className="flex flex-col gap-1 border border-decision bg-decision-wash px-3 py-2.5">
        <p className="text-micro uppercase tracking-[0.06em] text-decision font-semibold">
          Human decision
        </p>
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
    <div className="flex flex-col gap-2 border border-dashed border-hairline bg-transparent px-3 py-2.5">
      <p className="text-micro uppercase tracking-[0.06em] text-decision font-semibold">
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
    <div className="flex flex-col gap-3 bg-surface px-3 pb-3 pt-1">
      {/* Machine finding — unboxed and flush on surface */}
      <div className="flex flex-col gap-2">
        <p className="text-micro uppercase tracking-[0.06em] text-fg-muted font-semibold">
          Machine finding
        </p>
        <MachineSpanQuote finding={finding} />
        {showMachineReason && finding.machineReason !== null ? (
          <p className={cn(reasonClass)}>{finding.machineReason}</p>
        ) : null}
      </div>

      {/* Human decision — boxed */}
      <HumanDecisionBlock finding={finding} actions={actions} />
      <DecisionHistory finding={finding} />
    </div>
  );
}
