import { Loader2 } from "lucide-react";
import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
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
        <Button
          type="button"
          disabled={buildDisabled}
          className={cn(
            "h-8 rounded-none px-4 font-sans text-button font-medium shadow-none cursor-pointer transition-colors",
            filled
              ? "border border-primary bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs"
              : "border border-hairline bg-transparent text-fg-faint hover:bg-transparent",
            buildDisabled && "cursor-not-allowed opacity-50"
          )}
          onClick={() => {
            void onRunBuild();
          }}
        >
          {buildInFlight ? (
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              <span>Compiling</span>
            </>
          ) : (
            "Build it"
          )}
        </Button>
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
            className="cursor-pointer text-caption text-fg-muted underline underline-offset-4 hover:text-fg"
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
