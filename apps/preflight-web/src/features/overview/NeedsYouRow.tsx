/**
 * NeedsYouRow — one queue row for Overview (static; register link is the exit).
 * Why: mock data must not promise navigation that does not apply on this screen.
 */

import type { ReactElement } from "react";

import type { AssetListItemDTO } from "@preflight/schemas";

import { ChannelGlyph } from "@/features/assets/ChannelGlyph";
import { channelLabel, formatGeneratedAt } from "@/features/assets/lib";
import { StatusChip } from "@/features/assets/StatusChip";
import { OVERVIEW_QUEUE_GRID } from "@/features/overview/needs-you-table";

export function NeedsYouRow({
  asset,
}: {
  asset: AssetListItemDTO;
}): ReactElement {
  return (
    <div className={`${OVERVIEW_QUEUE_GRID} items-start py-3`}>
      <div className="px-1">
        <StatusChip status={asset.status} />
      </div>
      <span className="font-serif text-sm text-fg">{asset.headline}</span>
      <span className="flex items-center gap-1.5 text-xs text-fg-muted">
        <ChannelGlyph channel={asset.channel} className="h-3.5 w-3.5 shrink-0" />
        {channelLabel(asset.channel)}
      </span>
      <span className="text-xs text-fg-muted">{asset.campaignName}</span>
      <span className="text-xs text-fg">{asset.statusDetail}</span>
      <span className="whitespace-nowrap font-mono text-[11px] text-fg-muted">
        {formatGeneratedAt(asset.generatedAt)}
      </span>
    </div>
  );
}
