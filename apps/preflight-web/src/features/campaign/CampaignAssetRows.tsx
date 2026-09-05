/**
 * CampaignAssetRows — S4 asset list with register-style column headers.
 * Why: extracted from BuiltSummary for file size; natural flow, no inner scroll.
 */

import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import type { AssetListItemDTO } from "@preflight/schemas";

import { ChannelGlyph } from "@/features/assets/ChannelGlyph";
import { channelLabel } from "@/features/assets/lib";
import { StatusChip } from "@/features/assets/StatusChip";
import { cleanPlural } from "@/features/campaign/campaign-pane";

export function CampaignAssetRows({
  assets,
}: {
  assets: AssetListItemDTO[];
}): ReactElement {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[100px_minmax(0,1.8fr)_minmax(0,1.2fr)] items-baseline gap-4 border-b border-fg pb-2">
        <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
          Status
        </span>
        <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
          Asset
        </span>
        <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
          Reason
        </span>
      </div>
      {assets.map((asset) => (
        <button
          key={asset.id}
          type="button"
          className="grid cursor-pointer grid-cols-[100px_minmax(0,1.8fr)_minmax(0,1.2fr)] items-start gap-4 border-b border-hairline py-3 text-left hover:bg-hover"
          onClick={() => {
            void navigate(`/assets/${asset.id}`);
          }}
        >
          <StatusChip status={asset.status} />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-serif text-serif-row text-fg">
              {asset.headline}
            </span>
            <span className="flex items-center gap-1.5 font-sans text-caption text-fg-muted">
              <ChannelGlyph channel={asset.channel} className="h-3 w-3 shrink-0" />
              <span>{channelLabel(asset.channel)}</span>
            </span>
          </div>
          <span className="line-clamp-2 text-ui text-fg-muted">
            {cleanPlural(asset.statusDetail)}
          </span>
        </button>
      ))}
    </div>
  );
}
