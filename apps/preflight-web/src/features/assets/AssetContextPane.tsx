/**
 * AssetContextPane — Left column (Column 1: CONTEXT).
 * Why: read-only whole-asset context and proof metadata (09 Screen 1).
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import type { RerunStripDTO } from "@preflight/schemas";

import { AgentRunBadge } from "@/features/assets/AgentRunBadge";
import { ExceptionsSummary } from "@/features/assets/ExceptionsSummary";
import { formatAssetDetailSubtitle, shortId } from "@/features/assets/lib";
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
    <div className="flex h-full min-h-0 w-[300px] shrink-0 flex-col overflow-hidden border-r border-hairline bg-ground">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-4">
          {/* 1. Meta line */}
          <div>
            <p className="font-mono text-mono-meta text-fg-muted">
              {formatAssetDetailSubtitle(
                asset.channel,
                asset.id,
                asset.generatedAt,
              )}
            </p>
          </div>

          {/* 2. Lineage banner */}
          {asset.lineage !== null ? (
            <LineageBanner
              lineage={asset.lineage}
              generationIndex={asset.generationIndex}
            />
          ) : null}

          {/* 3. Provenance */}
          <AgentRunBadge run={asset.generatorRun} />

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

          {/* 5. Frozen ruleset */}
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
              Ruleset
            </span>
            <p className="font-mono text-mono-meta text-fg-muted">
              {asset.findings.length} rules pinned ·{" "}
              <span className="tabular-nums">{shortId(asset.rulesetHash)}</span>
            </p>
          </div>

          {/* 6. Exceptions banner */}
          {asset.exceptions.length > 0 ? (
            <ExceptionsSummary exceptions={asset.exceptions} />
          ) : null}

          {/* 7. Re-run deterministic */}
          <div className="border-t border-hairline pt-3">
            <RerunStrip
              strip={rerunStrip}
              onRerun={onRerun}
              rerunInFlight={rerunInFlight}
            />
          </div>
        </div>

        {/* Page termination line per 08 §4.5 */}
        <div className="mt-auto pt-6">
          <div className="border-t border-fg pt-2">
            <p className="font-sans text-label-strong uppercase tracking-[0.06em] text-fg-muted text-[10px]">
              Context · {asset.findings.length} rules pinned
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
