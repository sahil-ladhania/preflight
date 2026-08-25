/**
 * AssetListRow — Screen 2 R2b data row.
 * Why: one list row with chip, lineage, and navigation.
 */

import type { MouseEvent, ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";

import { formatGeneratedAt, shortId } from "@/features/assets/lib";
import { PendingRing } from "@/features/assets/PendingRing";
import { StatusChip } from "@/features/assets/StatusChip";
import type { AssetListRowProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

function VersionCell({
  generationIndex,
  regeneratedFromId,
  onParentClick,
}: {
  generationIndex: number;
  regeneratedFromId: string | null;
  onParentClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}): ReactElement {
  const showVersion =
    generationIndex > 1 || regeneratedFromId !== null;

  if (!showVersion) {
    return <span />;
  }

  return (
    <span className="text-caption text-fg-muted">
      {generationIndex > 1 ? (
        <span className="text-mono">v{generationIndex}</span>
      ) : null}
      {generationIndex > 1 && regeneratedFromId !== null ? " · " : null}
      {regeneratedFromId !== null ? (
        <>
          from{" "}
          <Link
            to={`/assets/${regeneratedFromId}`}
            className="text-primary underline hover:underline"
            onClick={onParentClick}
          >
            {shortId(regeneratedFromId)}
          </Link>
        </>
      ) : null}
    </span>
  );
}

export function AssetListRow({ asset }: AssetListRowProps): ReactElement {
  const navigate = useNavigate();

  const handleRowClick = (): void => {
    void navigate(`/assets/${asset.id}`);
  };

  const handleParentClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    event.stopPropagation();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleRowClick();
        }
      }}
      className={cn(
        "grid cursor-pointer grid-cols-[132px_minmax(0,1fr)_minmax(0,1fr)_168px_96px] items-center gap-4",
        "border-b border-border bg-canvas px-4 py-2 hover:bg-canvas-subtle",
      )}
    >
      <div className="flex min-w-[132px] items-center gap-2">
        <PendingRing active={asset.pendingCount > 0} />
        <StatusChip status={asset.status} />
      </div>
      <span className="truncate text-body text-fg">{asset.headline}</span>
      <span className="truncate text-caption text-fg-muted">
        {asset.statusDetail}
      </span>
      <span className="text-caption text-fg-muted">
        {formatGeneratedAt(asset.generatedAt)}
      </span>
      <VersionCell
        generationIndex={asset.generationIndex}
        regeneratedFromId={asset.regeneratedFromId}
        onParentClick={handleParentClick}
      />
    </div>
  );
}
