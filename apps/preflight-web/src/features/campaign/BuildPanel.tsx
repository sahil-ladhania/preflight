/**
 * BuildPanel — one-click autonomous campaign run with gate stops.
 * Why: operator talks, clicks Build it, watches phases, decides at the end.
 */

import { Loader2 } from "lucide-react";
import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { BuildPhase } from "@/features/campaign/types";
import type { BriefField } from "@preflight/schemas";

function phaseLine(phase: BuildPhase, inFlight: boolean): string | null {
  if (!inFlight && phase === "idle") {
    return null;
  }
  const labels: Partial<Record<BuildPhase, string>> = {
    extract: "Structuring your brief…",
    save: "Saving brief…",
    compile: "Freezing compliance rules…",
    generate: "Generating channel copy…",
    needs_input: "Add the highlighted fields below, then click Build it again.",
    needs_ack: "No rules apply — acknowledge to continue.",
    failed: "Build failed — fix the issue and try again.",
  };
  return labels[phase] ?? null;
}

export function BuildPanel({
  buildPhase,
  buildInFlight,
  missingFields,
  canBuild,
  emptySetAcknowledged,
  onRunBuild,
  onEmptySetAckChange,
}: {
  buildPhase: BuildPhase;
  buildInFlight: boolean;
  missingFields: BriefField[];
  canBuild: boolean;
  emptySetAcknowledged: boolean;
  onRunBuild: () => void;
  onEmptySetAckChange: (checked: boolean) => void;
}): ReactElement {
  const line = phaseLine(buildPhase, buildInFlight);
  const canResumeAck =
    buildPhase === "needs_ack" && emptySetAcknowledged && !buildInFlight;
  const buildLabel =
    buildPhase === "needs_ack" && emptySetAcknowledged
      ? "Continue generate"
      : "Build it";
  const buildDisabled =
    buildInFlight ||
    !canBuild ||
    (buildPhase === "needs_ack" && !emptySetAcknowledged);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-ground p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          className="h-9 rounded-md px-5"
          disabled={buildDisabled}
          onClick={() => {
            void onRunBuild();
          }}
        >
          {buildInFlight ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            buildLabel
          )}
        </Button>
        {line !== null ? (
          <p className="text-caption text-fg-muted">{line}</p>
        ) : null}
        {!canBuild && !buildInFlight ? (
          <p className="text-caption text-fg-muted">
            Describe or paste your brief below first.
          </p>
        ) : null}
      </div>
      {buildPhase === "needs_ack" ? (
        <label className="flex cursor-pointer items-start gap-2 text-body text-fg">
          <Checkbox
            checked={emptySetAcknowledged}
            onCheckedChange={(checked) => {
              onEmptySetAckChange(checked === true);
            }}
          />
          <span>
            No compliance rules apply to this brief — I acknowledge generating
            with an empty constraint set.
          </span>
        </label>
      ) : null}
      {canResumeAck ? (
        <p className="text-caption text-fg-muted">
          Empty set acknowledged — click Continue generate to finish.
        </p>
      ) : null}
      {buildPhase === "needs_input" && missingFields.length > 0 ? (
        <p className="sr-only">
          Missing fields highlighted in the form below.
        </p>
      ) : null}
    </div>
  );
}
