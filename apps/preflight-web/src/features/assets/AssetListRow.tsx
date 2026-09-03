/**
 * AssetListRow — Screen 2 R2 data row.
 * Why: one register row with status marker and navigation.
 */

import type { MouseEvent, ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";

import { formatGeneratedAt, shortId } from "@/features/assets/lib";
import { PendingRing } from "@/features/assets/PendingRing";
import { REGISTER_ROW_GRID } from "@/features/assets/register-lib";
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
    <span className="text-[11px] leading-[1.4] text-fg-muted">
      {generationIndex > 1 ? (
        <span className="font-mono text-[11px] leading-[1.4]">v{generationIndex}</span>
      ) : null}
      {generationIndex > 1 && regeneratedFromId !== null ? " · " : null}
      {regeneratedFromId !== null ? (
        <>
          from{" "}
          <Link
            to={`/assets/${regeneratedFromId}`}
            className="text-decision underline underline-offset-4"
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
        REGISTER_ROW_GRID,
        "cursor-pointer border-b border-hairline py-2.5 hover:bg-hover [&_.status-marker]:text-[10px]",
      )}
    >
      <div className="flex min-w-[110px] items-center gap-2">
        <PendingRing active={asset.pendingCount > 0} />
        <StatusChip status={asset.status} />
      </div>
      <span
        className="truncate font-serif text-caption text-fg"
        title={asset.headline}
      >
        {asset.headline}
      </span>
      <span
        className="truncate text-caption text-fg-muted"
        title={asset.campaignName}
      >
        {asset.campaignName}
      </span>
      <span className="text-caption text-fg">{asset.statusDetail}</span>
      <span className="text-[11px] leading-[1.4] text-fg-muted">
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
