/**
 * NeedsYouSection — top five actionable assets with register link.
 * Why: today's work queue, not the full Asset Register.
 */

import type { ReactElement } from "react";
import { Inbox, Scale } from "lucide-react";

import type { AssetListItemDTO } from "@preflight/schemas";

import { isNeedsYouStatus } from "@/features/assets/register-lib";
import { topNeedsYouAssets } from "@/features/overview/lib";
import {
  OVERVIEW_QUEUE_GRID,
  OVERVIEW_QUEUE_TABLE,
} from "@/features/overview/needs-you-table";
import { NeedsYouRow } from "@/features/overview/NeedsYouRow";
import { OverviewRegion } from "@/features/overview/OverviewRegion";
import { OverviewSectionHeading } from "@/features/overview/OverviewSectionHeading";
import { needsYouSectionTitle } from "@/features/overview/overview-copy";
import { RegisterLink } from "@/features/overview/RegisterLink";
import type { PersonaId } from "@/features/shell/types";

function needsYouSectionIcon(personaId: PersonaId): ReactElement {
  return personaId === "meera" ? (
    <Scale className="size-4" />
  ) : (
    <Inbox className="size-4" />
  );
}

export function NeedsYouSection({
  assets,
  personaId,
}: {
  assets: AssetListItemDTO[];
  personaId: PersonaId;
}): ReactElement {
  const queue = topNeedsYouAssets(assets, 5);
  const totalNeedYou = assets.filter((asset) => isNeedsYouStatus(asset.status)).length;

  return (
    <OverviewRegion id="needs-you" className="min-w-0 gap-2">
      <OverviewSectionHeading
        title={needsYouSectionTitle(personaId)}
        count={totalNeedYou}
        icon={needsYouSectionIcon(personaId)}
      />
      {queue.length === 0 ? (
        <p className="text-ui text-fg-muted">Nothing needs you.</p>
      ) : (
        <div className="-mx-6 overflow-x-auto px-6">
          <div className={OVERVIEW_QUEUE_TABLE}>
            <div className={`${OVERVIEW_QUEUE_GRID} border-b border-fg pb-2`}>
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
              <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
                Age
              </span>
            </div>
            {queue.map((asset) => (
              <div
                key={asset.id}
                className="border-b border-hairline last:border-b-0"
              >
                <NeedsYouRow asset={asset} />
              </div>
            ))}
          </div>
        </div>
      )}
      <RegisterLink />
    </OverviewRegion>
  );
}
