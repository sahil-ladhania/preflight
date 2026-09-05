/**
 * AssetReviewTopBar — Screen 1 top navigation bar.
 * Why: replaces app sidebar on review route (08 §5.1, 09 R0).
 */

import { Download } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import type { AssetStatus } from "@preflight/schemas";

import { StatusChip } from "@/features/assets/StatusChip";
import { cn } from "@/lib/utils";

export interface AssetReviewTopBarProps {
  headline: string;
  status: AssetStatus;
  queueIndex: number | null;
  queueTotal: number;
  hasPrevAsset: boolean;
  hasNextAsset: boolean;
  onPrevAsset?: () => void;
  onNextAsset?: () => void;
  onExport: () => void;
  exportInFlight?: boolean;
}

export function AssetReviewTopBar({
  headline,
  status,
  queueIndex,
  queueTotal,
  hasPrevAsset,
  hasNextAsset,
  onPrevAsset,
  onNextAsset,
  onExport,
  exportInFlight = false,
}: AssetReviewTopBarProps): ReactElement {
  const queueLabel =
    queueTotal === 0
      ? "All assets in review queue resolved"
      : queueIndex !== null
        ? `Asset ${queueIndex} of ${queueTotal} in review queue`
        : `${queueTotal} ${queueTotal === 1 ? "asset" : "assets"} in review queue`;

  return (
    <header
      className="flex h-topbar w-full shrink-0 items-center justify-between border-b border-[var(--color-chrome-edge)] px-6"
      style={{
        background:
          "linear-gradient(180deg, #2b3f54 0%, var(--color-chrome-bottom) 100%)",
      }}
    >
      {/* Left Slot: Exit, status (condition leads), headline */}
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to="/assets"
          className="inline-flex shrink-0 items-center gap-1 font-sans text-caption text-[var(--color-chrome-fg-muted)] hover:text-[var(--color-chrome-fg)] hover:underline"
        >
          <span aria-hidden="true">&larr;</span> Asset Register
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

      {/* Centre Slot: Queue stepper */}
      <div className="flex items-center gap-2 font-sans text-caption text-[var(--color-chrome-fg)]">
        <button
          type="button"
          className="cursor-pointer font-mono text-sm leading-none text-[var(--color-chrome-fg)] disabled:cursor-not-allowed disabled:opacity-30 hover:text-[var(--color-chrome-fg-muted)] p-0 bg-transparent border-0"
          disabled={!hasPrevAsset}
          onClick={onPrevAsset}
          aria-label="Previous asset in queue"
        >
          &lsaquo;
        </button>
        <span className="select-none font-medium">{queueLabel}</span>
        <button
          type="button"
          className="cursor-pointer font-mono text-sm leading-none text-[var(--color-chrome-fg)] disabled:cursor-not-allowed disabled:opacity-30 hover:text-[var(--color-chrome-fg-muted)] p-0 bg-transparent border-0"
          disabled={!hasNextAsset}
          onClick={onNextAsset}
          aria-label="Next asset in queue"
        >
          &rsaquo;
        </button>
      </div>

      {/* Right Slot: Export report bordered square pill */}
      <div className="flex items-center">
        <button
          type="button"
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-none border border-[var(--color-chrome-fg-muted)]/30 bg-transparent px-2.5 py-1 font-sans text-xs text-[var(--color-chrome-fg)] hover:border-[var(--color-chrome-fg-muted)] hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50",
            exportInFlight && "cursor-wait opacity-70",
          )}
          disabled={exportInFlight}
          onClick={onExport}
        >
          {exportInFlight ? (
            <span className="pending-ring" aria-hidden="true" />
          ) : (
            <Download className="size-3 shrink-0" aria-hidden="true" />
          )}
          <span>{exportInFlight ? "Exporting…" : "Export report"}</span>
        </button>
      </div>
    </header>
  );
}
