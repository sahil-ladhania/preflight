/**
 * AssetDetailShell — outer pad + page header for Screen 1 detail.
 * Why: wayfinding and inset family match list/rulebook; no PageStage (08 lock).
 */

import { ChevronLeft } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { formatAssetDetailSubtitle } from "@/features/assets/lib";
import type { AssetDetailShellProps } from "@/features/assets/types";

export function AssetDetailShell({
  children,
  headline,
  channel,
  assetId,
  generatedAt,
}: AssetDetailShellProps): ReactElement {
  const subtitle =
    channel !== undefined && assetId !== undefined && generatedAt !== undefined
      ? formatAssetDetailSubtitle(channel, assetId, generatedAt)
      : null;

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col bg-canvas-subtle p-4 sm:p-6">
      <header className="mb-4 flex shrink-0 flex-col gap-1">
        <Link
          to="/assets"
          className="inline-flex w-fit items-center gap-1 text-ui text-primary hover:underline"
        >
          <ChevronLeft className="size-4 shrink-0" aria-hidden />
          Assets
        </Link>
        {headline !== undefined ? (
          <h1 className="truncate text-title text-fg">{headline}</h1>
        ) : null}
        {subtitle !== null ? (
          <p className="text-caption text-fg-muted">{subtitle}</p>
        ) : null}
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-2">{children}</div>
    </div>
  );
}
