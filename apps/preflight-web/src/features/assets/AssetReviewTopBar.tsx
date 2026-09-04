/**
 * AssetReviewTopBar — Screen 1 top navigation bar.
 * Why: replaces app sidebar on review route (08 §5.1, 09 R0).
 */

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
      ? "All assets resolved"
      : queueIndex !== null
        ? `Asset ${queueIndex} of ${queueTotal} needing you`
        : `${queueTotal} needing you`;

  return (
    <header className="flex h-[52px] w-full shrink-0 items-center justify-between border-b border-fg bg-ground px-6">
      {/* Left Slot: Exit, headline, status */}
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to="/assets"
          className="inline-flex shrink-0 items-center gap-1 font-sans text-caption text-fg-muted hover:underline"
        >
          <span aria-hidden="true">&larr;</span> Asset Register
        </Link>
        <span className="text-hairline select-none">&middot;</span>
        <h1
          className="font-serif text-subject-title font-semibold text-fg"
          title={headline}
        >
          {headline}
        </h1>
        <StatusChip status={status} surface="detail" />
      </div>

      {/* Centre Slot: Queue stepper */}
      <div className="flex items-center gap-2 font-sans text-caption text-fg">
        <button
          type="button"
          className="cursor-pointer font-mono text-sm leading-none text-fg disabled:cursor-not-allowed disabled:opacity-30 hover:text-fg-muted p-0 bg-transparent border-0"
          disabled={!hasPrevAsset}
          onClick={onPrevAsset}
          aria-label="Previous asset in queue"
        >
          &lsaquo;
        </button>
        <span className="select-none font-medium">{queueLabel}</span>
        <button
          type="button"
          className="cursor-pointer font-mono text-sm leading-none text-fg disabled:cursor-not-allowed disabled:opacity-30 hover:text-fg-muted p-0 bg-transparent border-0"
          disabled={!hasNextAsset}
          onClick={onNextAsset}
          aria-label="Next asset in queue"
        >
          &rsaquo;
        </button>
      </div>

      {/* Right Slot: Export report plain-link tertiary only */}
      <div className="flex items-center">
        <button
          type="button"
          className={cn(
            "cursor-pointer font-sans text-xs text-fg-muted underline underline-offset-4 hover:text-fg font-normal bg-transparent border-0 p-0 shadow-none",
            exportInFlight && "cursor-wait opacity-70",
          )}
          disabled={exportInFlight}
          onClick={onExport}
        >
          {exportInFlight ? "Exporting…" : "Export report"}
        </button>
      </div>
    </header>
  );
}
