/**
 * AssetActionRow — R3a terminal action, regenerate, and export link.
 * Why: one action row with inline disabled reason (09 R3a).
 */

import { Loader2 } from "lucide-react";
import type { ReactElement } from "react";

import {
  acceptDisabledCaption,
  acceptIsEnabled,
} from "@/features/assets/lib";
import type { AssetActionRowProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

const filledButtonClass =
  "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center border border-fg bg-fg px-4 font-sans text-button font-medium text-surface disabled:cursor-not-allowed";

const disabledButtonClass =
  "inline-flex h-8 shrink-0 cursor-not-allowed items-center justify-center border border-hairline bg-surface px-4 font-sans text-button font-medium text-fg-faint";

const regenerateClass =
  "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center border border-fg bg-surface px-3 font-sans text-button-sm font-medium text-fg disabled:cursor-not-allowed disabled:opacity-50";

export function AssetActionRow({
  status,
  findingsCount,
  onAccept,
  onRegenerate,
  onExport,
  exportInFlight = false,
  regenerateInFlight = false,
}: AssetActionRowProps): ReactElement {
  const acceptEnabled = acceptIsEnabled(status);
  const disabledCaption = acceptDisabledCaption(status, findingsCount);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <button
          type="button"
          className={acceptEnabled ? filledButtonClass : disabledButtonClass}
          disabled={!acceptEnabled}
          onClick={acceptEnabled ? onAccept : undefined}
        >
          Ready for compliance desk
        </button>
        {!acceptEnabled && disabledCaption !== null ? (
          <span className="text-caption text-fg-muted">{disabledCaption}</span>
        ) : null}
        <button
          type="button"
          className={regenerateClass}
          disabled={regenerateInFlight}
          onClick={onRegenerate}
        >
          {regenerateInFlight ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            "Regenerate"
          )}
        </button>
        <button
          type="button"
          className={cn(
            "cursor-pointer font-sans text-caption text-fg-muted underline underline-offset-4",
            exportInFlight && "cursor-wait opacity-70",
          )}
          disabled={exportInFlight}
          onClick={onExport}
        >
          {exportInFlight ? "Exporting…" : "Export compliance report"}
        </button>
      </div>
    </div>
  );
}
