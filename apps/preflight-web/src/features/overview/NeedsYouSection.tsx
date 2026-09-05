/**
 * NeedsYouSection — top five actionable assets with register link.
 * Why: today's work queue, not the full Asset Register.
 */

import type { ReactElement } from "react";
import { Inbox } from "lucide-react";

import type { AssetListItemDTO } from "@preflight/schemas";

import { isNeedsYouStatus } from "@/features/assets/register-lib";
import { topNeedsYouAssets } from "@/features/overview/lib";
import { NeedsYouRow } from "@/features/overview/NeedsYouRow";
import { OverviewRegion } from "@/features/overview/OverviewRegion";
import { OverviewSectionHeading } from "@/features/overview/OverviewSectionHeading";
import { RegisterLink } from "@/features/overview/RegisterLink";

export function NeedsYouSection({
  assets,
}: {
  assets: AssetListItemDTO[];
}): ReactElement {
  const queue = topNeedsYouAssets(assets, 5);
  const totalNeedYou = assets.filter((asset) => isNeedsYouStatus(asset.status)).length;

  return (
    <OverviewRegion id="needs-you" className="gap-2">
      <OverviewSectionHeading
        title="Needs you"
        count={totalNeedYou}
        icon={<Inbox className="size-4" />}
      />
      {queue.length === 0 ? (
        <p className="text-ui text-fg-muted">Nothing needs you.</p>
      ) : (
        <div className="flex flex-col">
          <div className="grid grid-cols-[110px_minmax(0,1.2fr)_120px_minmax(140px,1fr)_minmax(180px,1.4fr)] gap-x-3 border-b border-fg pb-2">
            <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
              Status
            </span>
            <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
              Asset
            </span>
            <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
              Channel
            </span>
            <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
              Campaign
            </span>
            <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
              Reason
            </span>
          </div>
          {queue.map((asset) => (
            <NeedsYouRow key={asset.id} asset={asset} />
          ))}
        </div>
      )}
      <RegisterLink />
    </OverviewRegion>
  );
}
