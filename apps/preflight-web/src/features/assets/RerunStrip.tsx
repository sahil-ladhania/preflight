/**
 * RerunStrip — verify deterministic checks + rulebook drift (read-only).
 * Why: outcome-first audit strip after POST /assets/:id/rerun.
 */

import { useState, type ReactElement } from "react";
import { ChevronDown, ChevronRight, Loader2, RefreshCw } from "lucide-react";

import type { RerunStripDTO } from "@preflight/schemas";

import { Button } from "@/components/ui/button";
import { shortId } from "@/features/assets/lib";
import {
  DriftColumnHeaders,
  RerunDriftItem,
} from "@/features/assets/RerunDriftItem";
import {
  rerunDriftSummary,
  rerunEngineVerdict,
} from "@/features/assets/rerun-lib";
import type { RerunStripProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

function VerdictCard({
  title,
  body,
  tone = "neutral",
}: {
  title: string;
  body: string;
  tone?: "neutral" | "warn";
}): ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-md border px-3 py-2",
        tone === "warn"
          ? "border-fail/40 bg-canvas"
          : "border-border bg-canvas",
      )}
    >
      <p className="text-caption font-medium text-fg">{title}</p>
      <p className="text-caption text-fg-muted">{body}</p>
    </div>
  );
}

function HashDisclosure({ strip }: { strip: RerunStripDTO }): ReactElement {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="inline-flex w-fit items-center gap-1 text-caption text-primary underline underline-offset-4"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? (
          <ChevronDown className="size-3.5 shrink-0" aria-hidden />
        ) : (
          <ChevronRight className="size-3.5 shrink-0" aria-hidden />
        )}
        Show technical hashes
      </button>
      {open ? (
        <div className="flex flex-col gap-1 text-hash text-fg-muted">
          <p>
            Run {shortId(strip.runHash)} → re-run {shortId(strip.rerunHash)}
          </p>
          <p>
            Ruleset {shortId(strip.rulesetHash)} → live{" "}
            {shortId(strip.liveRulesetHash)}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function StripBody({ strip }: { strip: RerunStripDTO }): ReactElement {
  return (
    <div className="flex flex-col gap-3 border-t border-border bg-canvas-subtle px-4 py-3">
      <VerdictCard
        title="Copy checks"
        body={rerunEngineVerdict(strip)}
        tone={strip.hashesMatch ? "neutral" : "warn"}
      />
      <VerdictCard
        title="Rulebook since freeze"
        body={rerunDriftSummary(strip)}
        tone={strip.driftItems.length > 0 ? "warn" : "neutral"}
      />
      {strip.driftItems.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-caption font-medium text-fg">What changed in the rulebook</p>
          <DriftColumnHeaders />
          {strip.driftItems.map((item) => (
            <RerunDriftItem key={`${item.kind}-${item.ruleId}`} item={item} />
          ))}
        </div>
      ) : null}
      <HashDisclosure strip={strip} />
    </div>
  );
}

export function RerunStrip({
  strip,
  onRerun,
  rerunInFlight = false,
}: RerunStripProps): ReactElement {
  return (
    <div className="shrink-0 rounded-md border border-border bg-canvas-subtle">
      <div className="flex flex-col gap-2 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-md px-4"
            disabled={rerunInFlight}
            onClick={onRerun}
          >
            {rerunInFlight ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <>
                <RefreshCw className="size-4 shrink-0" aria-hidden />
                Verify deterministic checks
              </>
            )}
          </Button>
        </div>
        <p className="text-caption text-fg-muted">
          Re-runs frozen rules on this copy. Read-only — does not change pass/fail.
        </p>
      </div>
      {strip !== null ? <StripBody strip={strip} /> : null}
    </div>
  );
}
