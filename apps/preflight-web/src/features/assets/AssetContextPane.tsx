/**
 * AssetContextPane — Left column (Column 1: CONTEXT).
 * Why: read-only whole-asset context and proof metadata (09 Screen 1).
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import type { RerunStripDTO } from "@preflight/schemas";

import { AgentRunBadge } from "@/features/assets/AgentRunBadge";
import { ChannelGlyph } from "@/features/assets/ChannelGlyph";
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
  onOpenLineage?: () => void;
}

export function AssetContextPane({
  asset,
  campaignName,
  rerunStrip,
  onRerun,
  rerunInFlight = false,
  onOpenLineage,
}: AssetContextPaneProps): ReactElement {
  const displayCampaign =
    campaignName ?? `Campaign ${shortId(asset.campaignId)}`;

  return (
    <div className="flex h-full min-h-0 w-[20%] shrink-0 flex-col overflow-hidden border-r border-fg bg-surface">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-4 pb-5">
        {/* Column 1 Horizon Header */}
        <div className="flex h-7 shrink-0 items-center">
          <span className="font-sans text-label-strong uppercase tracking-[0.06em] text-fg-muted">
            Context
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-4">
          {/* 1. Meta line: glyph + channel · age ago */}
          <div className="flex items-center gap-1.5 font-mono text-mono-meta text-fg-muted">
            <ChannelGlyph channel={asset.channel} />
            <span>{formatContextSubtitle(asset.channel, asset.generatedAt)}</span>
          </div>

          {/* 2. Lineage banner */}
          {asset.lineage !== null ? (
            <LineageBanner
              lineage={asset.lineage}
              generationIndex={asset.generationIndex}
              onOpenLineage={onOpenLineage}
            />
          ) : null}

          {/* 3. Exceptions banner */}
          {asset.exceptions.length > 0 ? (
            <ExceptionsSummary exceptions={asset.exceptions} />
          ) : null}

          {/* 4. Campaign link - neutral link treatment per C2 */}
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
              Campaign
            </span>
            <Link
              to={`/campaign/${asset.campaignId}`}
              className="font-sans text-caption text-fg-muted underline underline-offset-4 hover:text-fg truncate"
              title={displayCampaign}
            >
              {displayCampaign}
            </Link>
          </div>

          {/* 5. Rules frozen */}
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
              Rules frozen
            </span>
            <p className="font-mono text-mono-meta text-fg-muted">
              {asset.findings.length} rules
            </p>
          </div>

          {/* 6. Provenance (A5) */}
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
              Provenance
            </span>
            <AgentRunBadge
              run={asset.generatorRun}
              generatedAt={asset.generatedAt}
            />
          </div>

          {/* 7. Re-check hard rules */}
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
