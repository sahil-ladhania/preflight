/**
 * AssetReviewTopBar — Screen 1 top navigation bar.
 * Why: replaces app sidebar on review route (08 §5.1, 09 R0).
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { AssetStatus } from "@preflight/schemas";

import { Button } from "@/components/ui/button";
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
  acceptEnabled: boolean;
  disabledReason: string | null;
  onAccept: () => void;
  onRegenerate: () => void;
  regenerateInFlight?: boolean;
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
  acceptEnabled,
  disabledReason,
  onAccept,
  onRegenerate,
  regenerateInFlight = false,
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
          className="max-w-[280px] truncate font-serif text-[15px] font-semibold text-fg"
          title={headline}
        >
          {headline}
        </h1>
        <span className="text-hairline select-none">&middot;</span>
        <StatusChip status={status} surface="detail" />
      </div>

      {/* Centre Slot: Queue stepper */}
      <div className="flex items-center gap-2 font-sans text-caption text-fg">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-6 rounded-none p-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-hover hover:text-fg"
          disabled={!hasPrevAsset}
          onClick={onPrevAsset}
          aria-label="Previous asset in queue"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </Button>
        <span className="select-none font-medium">{queueLabel}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-6 rounded-none p-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-hover hover:text-fg"
          disabled={!hasNextAsset}
          onClick={onNextAsset}
          aria-label="Next asset in queue"
        >
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>

      {/* Right Slot: Export, Regenerate, Ready with disabled reason */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className={cn(
            "cursor-pointer font-sans text-caption text-fg-muted underline underline-offset-4 hover:text-fg",
            exportInFlight && "cursor-wait opacity-70",
          )}
          disabled={exportInFlight}
          onClick={onExport}
        >
          {exportInFlight ? "Exporting…" : "Export report"}
        </button>

        <Button
          type="button"
          variant="outline"
          className="h-8 rounded-none border-fg bg-transparent px-3 font-sans text-xs font-medium text-fg hover:bg-hover cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          disabled={regenerateInFlight}
          onClick={onRegenerate}
        >
          {regenerateInFlight ? "Regenerating…" : "Regenerate"}
        </Button>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            className={cn(
              "h-8 rounded-none border px-4 font-sans text-xs font-medium leading-none",
              acceptEnabled
                ? "border-fg bg-fg text-surface hover:opacity-90 cursor-pointer"
                : "border-hairline bg-surface text-fg-faint cursor-not-allowed",
            )}
            disabled={!acceptEnabled}
            onClick={acceptEnabled ? onAccept : undefined}
          >
            Ready for compliance desk
          </Button>
          {!acceptEnabled && disabledReason !== null ? (
            <span className="font-sans text-caption text-fg-muted max-w-[200px] truncate" title={disabledReason}>
              {disabledReason}
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}
