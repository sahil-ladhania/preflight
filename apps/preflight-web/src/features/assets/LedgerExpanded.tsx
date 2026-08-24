/**
 * LedgerExpanded — R4c open finding detail and actions.
 * Why: one expanded ledger row at a time.
 */

import type { ReactElement } from "react";

import type { FindingDTO } from "@preflight/schemas";

import { Button } from "@/components/ui/button";
import {
  formatGeneratedAt,
  humanVerdictLabel,
} from "@/features/assets/lib";
import type { LedgerExpandedProps } from "@/features/assets/types";

const UNAVAILABLE_COPY =
  "Evaluation unavailable — span not found in asset. Deterministic results unaffected.";

function SnippetBlock({ finding }: { finding: FindingDTO }): ReactElement {
  if (finding.evaluationStatus === "pending") {
    return <p className="text-caption text-fg-muted">Evaluation in progress.</p>;
  }

  if (finding.evaluationStatus === "unavailable") {
    if (finding.spans.length === 0) {
      return (
        <p className="text-caption text-fg-muted">{UNAVAILABLE_COPY}</p>
      );
    }
    if (finding.machineReason !== null) {
      return (
        <p className="text-caption text-fg-muted">{finding.machineReason}</p>
      );
    }
    return (
      <p className="text-caption text-fg-muted">{UNAVAILABLE_COPY}</p>
    );
  }

  if (finding.spans.length === 0) {
    return (
      <p className="text-caption text-fg-muted">
        No span (absence rule or N/A)
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-canvas-subtle px-3 py-2">
      {finding.spans.map((span) => (
        <p key={`${span.start}-${span.end}`} className="text-mono text-fg">
          {span.text}
        </p>
      ))}
    </div>
  );
}

function ActionRow({ finding, onConfirm, onOverride, onWaive, onRetry }: LedgerExpandedProps): ReactElement | null {
  if (finding.machineVerdict === "pass") {
    return null;
  }
  if (finding.evaluationStatus === "pending") {
    return null;
  }
  if (finding.evaluationStatus === "unavailable") {
    return (
      <Button type="button" variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    );
  }
  if (finding.machineVerdict === "fail" && finding.kind === "deterministic") {
    return (
      <Button type="button" variant="outline" size="sm" onClick={onWaive}>
        Waive
      </Button>
    );
  }
  if (finding.machineVerdict === "fail" && finding.kind === "judgement") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onConfirm}>
          Confirm
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onOverride}>
          Override
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onWaive}>
          Waive
        </Button>
      </div>
    );
  }
  return null;
}

export function LedgerExpanded(props: LedgerExpandedProps): ReactElement {
  const { finding } = props;
  const showMachineReason =
    finding.evaluationStatus === "complete" && finding.machineReason !== null;

  const humanLine =
    finding.humanVerdict !== null &&
    finding.humanActor !== null &&
    finding.humanAt !== null
      ? `${humanVerdictLabel(finding.humanVerdict)} · ${finding.humanActor} · ${formatGeneratedAt(finding.humanAt)}`
      : "No human verdict";

  return (
    <div className="flex flex-col gap-3 border-t border-border px-3 py-3">
      <SnippetBlock finding={finding} />
      {showMachineReason && finding.machineReason !== null ? (
        <p className="text-caption text-fg-muted">{finding.machineReason}</p>
      ) : null}
      <div>
        <p className="text-caption text-fg-muted">Rule</p>
        <p className="text-body text-fg">{finding.frozenWording}</p>
      </div>
      <p className="text-caption text-fg-muted">{humanLine}</p>
      <ActionRow {...props} />
    </div>
  );
}
