/**
 * RerunStrip — re-run deterministic checks + rulebook drift (read-only).
 * Why: outcome-first audit strip after POST /assets/:id/rerun.
 */

import { useState, type ReactElement } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";

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
        "flex flex-col gap-1 border px-3 py-2",
        tone === "warn" ? "border-fail bg-surface" : "border-hairline bg-surface",
      )}
    >
      <p className="font-sans text-caption font-medium text-fg">{title}</p>
      <p className="font-sans text-caption text-fg-muted">{body}</p>
    </div>
  );
}

function HashDisclosure({ strip }: { strip: RerunStripDTO }): ReactElement {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="inline-flex w-fit cursor-pointer items-center gap-1 font-sans text-caption text-fg-muted underline underline-offset-4"
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
        <div className="flex flex-col gap-1 font-mono text-mono-faint text-fg-muted">
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
    <div className="flex flex-col gap-3 border-t border-hairline pt-3">
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
          <p className="font-sans text-caption font-medium text-fg">
            What changed in the rulebook
          </p>
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
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 cursor-pointer rounded-none border-border bg-surface text-xs text-fg shadow-none hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50"
          disabled={rerunInFlight}
          onClick={onRerun}
        >
          {rerunInFlight ? (
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              Re-checking…
            </>
          ) : (
            <>
              <span className="text-xs" aria-hidden="true">
                ↻
              </span>
              Re-check hard rules
            </>
          )}
        </Button>
      </div>
      <p className="font-sans text-caption text-fg-muted">
        Checks this copy against the rules frozen when it was made. Changes no verdict.
      </p>
      {strip !== null ? <StripBody strip={strip} /> : null}
    </div>
  );
}
