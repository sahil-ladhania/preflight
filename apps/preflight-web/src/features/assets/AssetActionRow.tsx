/**
 * AssetActionRow — R3a terminal action, regenerate, and export link.
 * Why: primary/secondary footer tiers with inline disabled reason (09 R3a).
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
  acceptDisabledCaption,
  acceptIsEnabled,
} from "@/features/assets/lib";
import type { AssetActionRowProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

const captionClass = "font-sans text-caption font-normal text-fg-muted";
const supportingLineClass = cn("mt-2", captionClass);

const SUPPORTING_COPY =
  "Marks this asset ready for the compliance desk. Preflight does not publish.";

function ReadyButton({
  enabled,
  onAccept,
}: {
  enabled: boolean;
  onAccept: () => void;
}): ReactElement {
  return (
    <Button
      type="button"
      className={cn(
        "h-8 rounded-none border px-4 font-sans text-(length:--text-button) font-medium leading-none",
        enabled
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary-hover cursor-pointer shadow-xs"
          : "border-hairline bg-surface text-fg-faint cursor-not-allowed",
      )}
      disabled={!enabled}
      onClick={enabled ? onAccept : undefined}
    >
      Ready for compliance desk
    </Button>
  );
}

function RegenerateButton({
  primary,
  inFlight,
  onRegenerate,
}: {
  primary: boolean;
  inFlight: boolean;
  onRegenerate: () => void;
}): ReactElement {
  return (
    <Button
      type="button"
      className={cn(
        "h-8 rounded-none border px-4 font-sans text-(length:--text-button) font-medium leading-none cursor-pointer disabled:cursor-not-allowed",
        primary
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs"
          : "border-hairline bg-surface text-fg hover:bg-hover disabled:opacity-50",
      )}
      disabled={inFlight}
      onClick={onRegenerate}
    >
      {inFlight ? "Regenerating…" : "Regenerate"}
    </Button>
  );
}

function ExportLink({
  inFlight,
  onExport,
}: {
  inFlight: boolean;
  onExport: () => void;
}): ReactElement {
  return (
    <button
      type="button"
      className={cn(
        "shrink-0 cursor-pointer underline underline-offset-4 font-sans text-caption font-normal text-fg-muted rounded-none hover:text-fg",
        inFlight && "cursor-wait opacity-70",
      )}
      disabled={inFlight}
      onClick={onExport}
    >
      {inFlight ? "Exporting…" : "Export report"}
    </button>
  );
}

export function AssetActionRow({
  status,
  findings,
  onAccept,
  onRegenerate,
  onExport,
  exportInFlight = false,
  regenerateInFlight = false,
}: AssetActionRowProps): ReactElement {
  const acceptEnabled = acceptIsEnabled(status);
  const disabledCaption = acceptDisabledCaption(status, findings);

  return (
    <div className="flex w-full flex-col items-start gap-3">
      {acceptEnabled ? (
        <div>
          <ReadyButton enabled onAccept={onAccept} />
          <p className={supportingLineClass}>{SUPPORTING_COPY}</p>
        </div>
      ) : (
        <RegenerateButton
          primary
          inFlight={regenerateInFlight}
          onRegenerate={onRegenerate}
        />
      )}

      <div className="w-full border-t border-hairline" aria-hidden />

      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
          {acceptEnabled ? (
            <RegenerateButton
              primary={false}
              inFlight={regenerateInFlight}
              onRegenerate={onRegenerate}
            />
          ) : (
            <>
              <ReadyButton enabled={false} onAccept={onAccept} />
              {disabledCaption !== null ? (
                <span className={captionClass}>{disabledCaption}</span>
              ) : null}
            </>
          )}
        </div>
        <ExportLink inFlight={exportInFlight} onExport={onExport} />
      </div>

      {!acceptEnabled ? (
        <p className={supportingLineClass}>{SUPPORTING_COPY}</p>
      ) : null}
    </div>
  );
}
