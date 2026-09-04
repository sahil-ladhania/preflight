/**
 * AssetContextPane — Left column (Column 1: CONTEXT).
 * Why: read-only whole-asset context and proof metadata (09 Screen 1).
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import type { RerunStripDTO } from "@preflight/schemas";

import { ExceptionsSummary } from "@/features/assets/ExceptionsSummary";
import { formatContextSubtitle, shortId } from "@/features/assets/lib";
import { LineageBanner } from "@/features/assets/LineageBanner";
import { RerunStrip } from "@/features/assets/RerunStrip";
import type { AssetDetailFixture } from "@/features/assets/types";

export interface AssetContextPaneProps {
  asset: AssetDetailFixture;
  campaignName?: string;
  rerunStrip: RerunStripDTO | null;
  onRerun: () => void;
  rerunInFlight?: boolean;
}

export function AssetContextPane({
  asset,
  campaignName,
  rerunStrip,
  onRerun,
  rerunInFlight = false,
}: AssetContextPaneProps): ReactElement {
  const displayCampaign =
    campaignName ?? `Campaign ${shortId(asset.campaignId)}`;

  return (
    <div className="flex h-full min-h-0 w-[20%] shrink-0 flex-col overflow-hidden border-r border-hairline bg-ground">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-4">
          {/* 1. Meta line: channel · age ago (no asset ID) */}
          <div>
            <p className="font-mono text-mono-meta text-fg-muted">
              {formatContextSubtitle(asset.channel, asset.generatedAt)}
            </p>
          </div>

          {/* 2. Lineage banner */}
          {asset.lineage !== null ? (
            <LineageBanner
              lineage={asset.lineage}
              generationIndex={asset.generationIndex}
            />
          ) : null}

          {/* 3. Exceptions banner (above campaign per spec) */}
          {asset.exceptions.length > 0 ? (
            <ExceptionsSummary exceptions={asset.exceptions} />
          ) : null}

          {/* 4. Campaign link */}
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
              Campaign
            </span>
            <Link
              to={`/campaign/${asset.campaignId}`}
              className="font-sans text-caption text-decision underline underline-offset-4 hover:text-fg truncate"
              title={displayCampaign}
            >
              {displayCampaign}
            </Link>
          </div>

          {/* 5. Rules frozen (no hash) */}
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
              Rules frozen
            </span>
            <p className="font-mono text-mono-meta text-fg-muted">
              {asset.findings.length} rules
            </p>
          </div>

          {/* 6. Re-check hard rules */}
          <div className="border-t border-hairline pt-3">
            <RerunStrip
              strip={rerunStrip}
              onRerun={onRerun}
              rerunInFlight={rerunInFlight}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
