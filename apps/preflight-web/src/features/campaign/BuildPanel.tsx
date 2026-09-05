import { BookOpen, Hammer, Loader2 } from "lucide-react";
import type { ReactElement } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { buildPhaseLine } from "@/features/campaign/campaign-pane";
import type { BuildPhase } from "@/features/campaign/types";
import { cn } from "@/lib/utils";

function inFlightButtonLabel(phase: BuildPhase): string {
  switch (phase) {
    case "extract":
      return "Structuring…";
    case "save":
      return "Saving…";
    case "compile":
      return "Freezing…";
    case "generate":
      return "Writing…";
    default:
      return "Building…";
  }
}

export function BuildPanel({
  buildPhase,
  buildInFlight,
  canBuild,
  emptySetAcknowledged,
  onRunBuild,
  onEmptySetAckChange,
  onTryExample,
}: {
  buildPhase: BuildPhase;
  buildInFlight: boolean;
  canBuild: boolean;
  emptySetAcknowledged: boolean;
  onRunBuild: () => void;
  onEmptySetAckChange: (checked: boolean) => void;
  onTryExample?: () => void;
}): ReactElement {
  const line = buildPhaseLine(buildPhase, buildInFlight);
  const adjacentLine =
    !buildInFlight
      ? (line ?? (!canBuild ? "Describe or paste your brief to start." : null))
      : null;
  const isActionable =
    canBuild &&
    !buildInFlight &&
    !(buildPhase === "needs_ack" && !emptySetAcknowledged);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!isActionable && !buildInFlight}
          className={cn(
            "flex h-8 shrink-0 items-center justify-center gap-2 rounded-none px-4 font-sans text-button font-medium select-none shadow-none transition-colors",
            buildInFlight &&
              "border border-primary bg-primary text-primary-foreground shadow-xs cursor-wait",
            isActionable &&
              "border border-primary bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs cursor-pointer",
            !isActionable &&
              !buildInFlight &&
              "border border-hairline bg-transparent text-fg-faint cursor-not-allowed",
          )}
          onClick={() => {
            if (isActionable) {
              void onRunBuild();
            }
          }}
        >
          {buildInFlight ? (
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
              <span>{inFlightButtonLabel(buildPhase)}</span>
            </>
          ) : (
            <>
              <Hammer className="size-3.5 shrink-0" aria-hidden="true" />
              <span>Build it</span>
            </>
          )}
        </button>
        {onTryExample !== undefined && !buildInFlight ? (
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 text-caption text-fg-muted underline underline-offset-4 hover:text-fg"
            onClick={onTryExample}
          >
            <BookOpen className="size-3.5 shrink-0" aria-hidden="true" />
            Try an example
          </button>
        ) : null}
        {!buildInFlight && adjacentLine !== null ? (
          <p className="text-caption text-fg-muted">{adjacentLine}</p>
        ) : null}
      </div>
      {buildInFlight && line !== null ? (
        <p className="text-ui font-medium text-fg" aria-live="polite">
          {line}
        </p>
      ) : null}
      {buildPhase === "needs_ack" ? (
        <label className="flex cursor-pointer items-start gap-2.5 border border-attention bg-surface p-3 text-ui text-fg">
          <Checkbox
            checked={emptySetAcknowledged}
            onCheckedChange={(checked) => {
              onEmptySetAckChange(checked === true);
            }}
            className="rounded-none cursor-pointer mt-0.5"
          />
          <span className="leading-snug">
            No compliance rules apply to this brief — I acknowledge generating
            with an empty constraint set.
          </span>
        </label>
      ) : null}
    </div>
  );
}
