/**
 * AssetListRow — Screen 2 R2 data row.
 * Why: one register row with status marker and navigation.
 */

import type { MouseEvent, ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatGeneratedAt, shortId } from "@/features/assets/lib";
import { PendingRing } from "@/features/assets/PendingRing";
import { StatusChip } from "@/features/assets/StatusChip";
import type { AssetListRowProps } from "@/features/assets/types";

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
    <div className="flex items-center gap-1.5 text-[11px] text-fg-muted">
      {generationIndex > 1 ? (
        <Badge
          variant="outline"
          className="rounded-none border-primary/30 bg-primary-wash/80 px-1 py-0 font-mono text-[10px] text-primary font-medium"
        >
          v{generationIndex}
        </Badge>
      ) : null}
      {regeneratedFromId !== null ? (
        <span className="text-[11px]">
          from{" "}
          <Link
            to={`/assets/${regeneratedFromId}`}
            className="font-mono text-primary underline underline-offset-4 hover:text-primary/80"
            onClick={onParentClick}
          >
            {shortId(regeneratedFromId)}
          </Link>
        </span>
      ) : null}
    </div>
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
    <TableRow
      role="button"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleRowClick();
        }
      }}
      className="cursor-pointer border-b border-hairline hover:bg-hover"
    >
      <TableCell className="w-[120px] px-3 py-3 align-middle">
        <div className="flex items-center gap-2">
          <PendingRing active={asset.pendingCount > 0} />
          <StatusChip status={asset.status} />
        </div>
      </TableCell>
      <TableCell className="min-w-[180px] px-3 py-3 align-middle font-serif text-sm text-fg">
        <span className="line-clamp-2" title={asset.headline}>
          {asset.headline}
        </span>
      </TableCell>
      <TableCell className="w-[140px] px-3 py-3 align-middle text-xs text-fg-muted">
        <span className="block truncate" title={asset.campaignName}>
          {asset.campaignName}
        </span>
      </TableCell>
      <TableCell className="min-w-[200px] px-3 py-3 align-middle text-xs text-fg">
        <span className="line-clamp-2">{asset.statusDetail}</span>
      </TableCell>
      <TableCell className="w-[150px] whitespace-nowrap px-3 py-3 align-middle font-mono text-[11px] text-fg-muted">
        {formatGeneratedAt(asset.generatedAt)}
      </TableCell>
      <TableCell className="w-[110px] px-3 py-3 align-middle">
        <VersionCell
          generationIndex={asset.generationIndex}
          regeneratedFromId={asset.regeneratedFromId}
          onParentClick={handleParentClick}
        />
      </TableCell>
    </TableRow>
  );
}
