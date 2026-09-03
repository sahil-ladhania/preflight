/**
 * AssetActionRow — R3a terminal action, regenerate, and export link.
 * Why: primary/secondary footer tiers with inline disabled reason (09 R3a).
 */

import type { ReactElement } from "react";

import {
  acceptDisabledCaption,
  acceptIsEnabled,
} from "@/features/assets/lib";
import type { AssetActionRowProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

const buttonTypeClass =
  "font-sans text-(length:--text-button) leading-none font-medium";

const filledButtonClass = cn(
  "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-none border border-fg bg-fg px-4 text-surface disabled:cursor-not-allowed",
  buttonTypeClass,
);

const disabledButtonClass = cn(
  "inline-flex h-8 shrink-0 cursor-not-allowed items-center justify-center rounded-none border border-hairline bg-surface px-4 text-fg-faint",
  buttonTypeClass,
);

const quietButtonClass = cn(
  "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-none border border-hairline bg-surface px-4 text-fg disabled:cursor-not-allowed disabled:opacity-50",
  buttonTypeClass,
);

const captionClass = "font-sans text-caption font-normal text-fg-muted";

const exportLinkClass = cn(
  "shrink-0 cursor-pointer underline underline-offset-4",
  captionClass,
);

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
    <button
      type="button"
      className={enabled ? filledButtonClass : disabledButtonClass}
      disabled={!enabled}
      onClick={enabled ? onAccept : undefined}
    >
      Ready for compliance desk
    </button>
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
    <button
      type="button"
      className={primary ? filledButtonClass : quietButtonClass}
      disabled={inFlight}
      onClick={onRegenerate}
    >
      {inFlight ? "Regenerating…" : "Regenerate"}
    </button>
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
        exportLinkClass,
        "rounded-none",
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
