/**
 * GenerateBlock — S3 frozen summary and Generate control.
 * Why: gate captions and navigate on success.
 */

import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { shortHash } from "@/features/campaign/lib";
import type { GenerateBlockProps } from "@/features/campaign/types";

export function GenerateBlock({
  compileResult,
  dimmed,
  disabled,
  disabledCaption,
  generateInFlight,
  onGenerate,
}: GenerateBlockProps): ReactElement {
  const ruleCount = compileResult?.ruleIds.length ?? 0;
  const hash = compileResult?.rulesetHash ?? "";

  return (
    <div
      className={
        dimmed ? "pointer-events-none flex flex-col gap-4 opacity-40" : "flex flex-col gap-4"
      }
    >
      {compileResult !== null ? (
        <p className="text-caption text-fg-muted">
          {ruleCount} rules frozen ·{" "}
          <span className="text-hash text-fg-muted">{shortHash(hash)}</span>
        </p>
      ) : null}
      <div className="flex flex-col items-start gap-1">
        <Button
          type="button"
          className="h-8 rounded-md px-4"
          disabled={disabled || generateInFlight}
          onClick={onGenerate}
        >
          {generateInFlight ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            "Generate"
          )}
        </Button>
        {disabledCaption !== null ? (
          <span className="text-caption text-fg-muted">{disabledCaption}</span>
        ) : null}
      </div>
    </div>
  );
}
