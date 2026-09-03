/**
 * BuildPanel — one filled Build it control with adjacent outcome lines.
 * Why: 09 Screen 3 single primary action; reasons never in tooltips.
 */

import type { ReactElement } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { buildPhaseLine } from "@/features/campaign/campaign-pane";
import type { BuildPhase } from "@/features/campaign/types";
import { cn } from "@/lib/utils";

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
  const showEmptyReason = !canBuild && !buildInFlight && line === null;
  const buildDisabled =
    buildInFlight ||
    !canBuild ||
    (buildPhase === "needs_ack" && !emptySetAcknowledged);
  const filled = canBuild && !buildDisabled;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={buildDisabled}
          className={cn(
            "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-2 px-4 font-sans text-button font-medium disabled:cursor-not-allowed",
            filled
              ? "border border-fg bg-fg text-surface"
              : "border border-hairline bg-transparent text-fg-faint",
          )}
          onClick={() => {
            void onRunBuild();
          }}
        >
          {buildInFlight ? (
            <>
              <span
                className="size-[11px] animate-spin rounded-full border-2 border-surface/40 border-t-surface"
                aria-hidden
              />
              Compiling
            </>
          ) : (
            "Build it"
          )}
        </button>
        {!buildInFlight && line !== null ? (
          <p className="text-caption text-fg-muted">{line}</p>
        ) : null}
        {showEmptyReason ? (
          <p className="text-caption text-fg-muted">
            Describe or paste your brief to start.
          </p>
        ) : null}
        {onTryExample !== undefined && !buildInFlight ? (
          <button
            type="button"
            className="cursor-pointer text-caption text-fg-muted underline underline-offset-4"
            onClick={onTryExample}
          >
            Try an example
          </button>
        ) : null}
      </div>
      {buildInFlight && line !== null ? (
        <p className="text-ui font-medium text-fg" aria-live="polite">
          {line}
        </p>
      ) : null}
      {buildPhase === "needs_ack" ? (
        <label className="flex cursor-pointer items-start gap-2 text-ui text-fg">
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
    </div>
  );
}
