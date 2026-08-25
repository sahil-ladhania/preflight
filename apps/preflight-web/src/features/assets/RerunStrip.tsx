/**
 * RerunStrip — R5 re-run control and R6 hash/drift strip.
 * Why: read-only engine compare after POST /assets/:id/rerun.
 */

import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";

import type { DriftItemDTO, RerunStripDTO } from "@preflight/schemas";

import { Button } from "@/components/ui/button";
import type { RerunStripProps } from "@/features/assets/types";

function DriftItemRow({ item }: { item: DriftItemDTO }): ReactElement {
  if (item.kind === "definition_changed") {
    const changeLabels = item.changes.map((change) => {
      if (change === "wording") {
        return "wording";
      }
      if (change === "predicate") {
        return "applicability spec changed";
      }
      return "matcher changed";
    });

    return (
      <div className="flex flex-col gap-2 border-t border-border pt-3">
        <p className="text-mono text-fg-muted">{item.ruleId}</p>
        <div className="flex flex-wrap gap-1">
          {changeLabels.map((label) => (
            <span
              key={label}
              className="rounded-md border border-border px-2 py-0.5 text-caption text-fg-muted"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border bg-canvas p-3 text-body text-fg">
            {item.frozenWording}
          </div>
          <div className="rounded-md border border-border bg-canvas p-3 text-body text-fg">
            {item.liveWording}
          </div>
        </div>
      </div>
    );
  }

  if (item.kind === "rules_added_outside_freeze") {
    return (
      <div className="flex flex-col gap-2 border-t border-border pt-3">
        <p className="text-mono text-fg-muted">{item.ruleId}</p>
        <div className="grid grid-cols-2 gap-2">
          <p className="text-caption text-fg-muted">not in this run</p>
          <div className="rounded-md border border-border bg-canvas p-3 text-body text-fg">
            {item.liveWording}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 border-t border-border pt-3">
      <p className="text-mono text-fg-muted">{item.ruleId}</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border border-border bg-canvas p-3 text-body text-fg">
          {item.frozenWording}
        </div>
        <p className="text-caption text-fg-muted">removed from catalog</p>
      </div>
    </div>
  );
}

function StripBody({ strip }: { strip: RerunStripDTO }): ReactElement {
  return (
    <div className="flex flex-col gap-3 border-t border-border bg-canvas-subtle px-4 py-3">
      <p className="text-hash text-fg-muted">
        {strip.runHash} {strip.rerunHash}{" "}
        {strip.hashesMatch ? "Hashes match." : "Engine mismatch."}
      </p>
      <p className="text-hash text-fg-muted">
        {strip.rulesetHash} {strip.liveRulesetHash}{" "}
        {strip.rulesetHash === strip.liveRulesetHash
          ? "Ruleset pin matches live catalog."
          : "Ruleset pin differs from live catalog."}
      </p>
      {strip.driftItems.length > 0 ? (
        <>
          <span className="inline-flex w-fit rounded-md border border-border px-2 py-0.5 text-caption text-fg-muted">
            {strip.driftItems.length} catalog changes
          </span>
          {strip.driftItems.map((item) => (
            <DriftItemRow key={`${item.kind}-${item.ruleId}`} item={item} />
          ))}
        </>
      ) : null}
    </div>
  );
}

export function RerunStrip({
  strip,
  onRerun,
  rerunInFlight = false,
}: RerunStripProps): ReactElement {
  const handleRerun = (): void => {
    // Will POST /assets/:id/rerun and replace strip from response.
    onRerun();
  };

  return (
    <div className="shrink-0 border-t border-border bg-canvas-subtle">
      <div className="px-4 py-3">
        <Button
          type="button"
          variant="outline"
          disabled={rerunInFlight}
          onClick={handleRerun}
        >
          {rerunInFlight ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            "Re-run deterministic"
          )}
        </Button>
      </div>
      {strip !== null ? <StripBody strip={strip} /> : null}
    </div>
  );
}
