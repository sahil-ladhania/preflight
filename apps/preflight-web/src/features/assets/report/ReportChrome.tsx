/**
 * ReportChrome — full-bleed top bar for the compliance exhibit.
 * Why: read-only record chrome mirrors review bar without queue stepper.
 */

import { ChevronLeft, Download } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import type { AssetStatus } from "@preflight/schemas";

import { StatusChip } from "@/features/assets/StatusChip";
import { cn } from "@/lib/utils";

export interface ReportChromeProps {
  assetId: string;
  headline: string;
  status: AssetStatus;
  onDownload: () => void;
  downloadInFlight?: boolean;
}

export function ReportChrome({
  assetId,
  headline,
  status,
  onDownload,
  downloadInFlight = false,
}: ReportChromeProps): ReactElement {
  return (
    <header
      className="report-chrome flex h-topbar w-full shrink-0 items-center justify-between border-b border-[var(--color-chrome-edge)] px-6 print:hidden"
      style={{
        background:
          "linear-gradient(180deg, #2b3f54 0%, var(--color-chrome-bottom) 100%)",
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to={`/assets/${assetId}`}
          className="inline-flex shrink-0 items-center gap-1 font-sans text-caption text-[var(--color-chrome-fg-muted)] hover:text-[var(--color-chrome-fg)] hover:underline"
        >
          <ChevronLeft className="size-3.5 shrink-0" aria-hidden />
          Back to asset
        </Link>
        <span className="text-white/20 select-none">&middot;</span>
        <StatusChip status={status} surface="chrome" />
        <span className="text-white/20 select-none">&middot;</span>
        <h1
          className="font-serif text-base font-semibold text-[var(--color-chrome-fg)] truncate max-w-[420px]"
          title={headline}
        >
          {headline}
        </h1>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-none border border-[var(--color-chrome-fg-muted)]/30 bg-transparent px-2.5 py-1 font-sans text-xs text-[var(--color-chrome-fg)] hover:border-[var(--color-chrome-fg-muted)] hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50",
            downloadInFlight && "cursor-wait opacity-70",
          )}
          disabled={downloadInFlight}
          onClick={onDownload}
        >
          {downloadInFlight ? (
            <span className="pending-ring" aria-hidden="true" />
          ) : (
            <Download className="size-3 shrink-0" aria-hidden="true" />
          )}
          <span>{downloadInFlight ? "Downloading…" : "Download JSON"}</span>
        </button>
      </div>
    </header>
  );
}
