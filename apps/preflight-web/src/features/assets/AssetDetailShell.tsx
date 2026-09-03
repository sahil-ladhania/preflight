/**
 * AssetDetailShell — outer pad + page header for Screen 1 detail.
 * Why: wayfinding and inset family match list/rulebook; no PageStage (08 lock).
 */

import { ChevronLeft } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { formatAssetDetailSubtitle } from "@/features/assets/lib";
import { StatusChip } from "@/features/assets/StatusChip";
import type { AssetDetailShellProps } from "@/features/assets/types";

export function AssetDetailShell({
  children,
  headline,
  channel,
  assetId,
  generatedAt,
  status,
}: AssetDetailShellProps): ReactElement {
  const showMeta =
    channel !== undefined &&
    assetId !== undefined &&
    generatedAt !== undefined &&
    status !== undefined;

  return (
    <div className="flex min-h-below-topbar flex-col bg-ground pt-7 pb-0">
      <header className="flex shrink-0 flex-col gap-2 px-8">
        <Link
          to="/assets"
          className="inline-flex w-fit items-center gap-1 font-sans text-caption text-fg-muted hover:underline"
        >
          <ChevronLeft className="size-4 shrink-0" aria-hidden />
          Asset Register
        </Link>
        {headline !== undefined ? (
          <h1 className="truncate font-serif text-subject-title text-fg">
            {headline}
          </h1>
        ) : null}
        {showMeta ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pb-4">
            <StatusChip status={status} surface="detail" />
            <span className="font-mono text-mono-meta text-fg-muted">
              {formatAssetDetailSubtitle(channel, assetId, generatedAt)}
            </span>
          </div>
        ) : null}
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
