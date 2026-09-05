/**
 * BuiltSummary — S4 return-visit campaign summary with asset rows.
 * Why: only screen that answers whether the campaign set is ready to ship.
 */

import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import type { AssetListItemDTO, CompileResponseDTO, StructuredBriefInput } from "@preflight/schemas";

import { ChannelGlyph } from "@/features/assets/ChannelGlyph";
import { channelLabel } from "@/features/assets/lib";
import { StatusChip } from "@/features/assets/StatusChip";
import {
  campaignProgressLine,
  cleanPlural,
  countNeedsHuman,
  countPendingFindings,
} from "@/features/campaign/campaign-pane";
import { shortHash } from "@/features/campaign/lib";

export interface BuiltSummaryProps {
  brief: StructuredBriefInput;
  compileResult: CompileResponseDTO | null;
  assets: AssetListItemDTO[];
  onEditBrief: () => void;
  onViewFreeze: () => void;
}

function TertiaryLink({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}): ReactElement {
  return (
    <button
      type="button"
      className="cursor-pointer font-sans text-caption text-fg-muted underline underline-offset-4 hover:text-fg"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function BuiltSummary({
  brief,
  compileResult,
  assets,
  onEditBrief,
  onViewFreeze,
}: BuiltSummaryProps): ReactElement {
  const navigate = useNavigate();
  const ruleCount = compileResult?.ruleIds.length ?? 0;
  const hash = compileResult?.rulesetHash ?? "";
  const progress = campaignProgressLine(assets);
  const allCleared =
    assets.length > 0 &&
    countNeedsHuman(assets) === 0 &&
    countPendingFindings(assets) === 0;

  return (
    <div className="flex flex-1 flex-col justify-between">
      <div className="flex flex-col gap-7">
        <section className="flex flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <h2 className="font-sans text-label-strong uppercase tracking-wider text-fg-muted">
              Brief summary
            </h2>
            <TertiaryLink onClick={onEditBrief}>Edit brief</TertiaryLink>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 border border-hairline bg-surface p-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-label uppercase tracking-wider text-fg-muted">Objective</span>
              <span className="font-serif text-copy text-fg">{brief.objective || "—"}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-label uppercase tracking-wider text-fg-muted">Scheme</span>
              <span className="font-serif text-copy text-fg">{brief.schemeName} ({brief.schemeCategory})</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-label uppercase tracking-wider text-fg-muted">Audience & Market</span>
              <span className="font-serif text-copy text-fg">{brief.audience} · {brief.market}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-label uppercase tracking-wider text-fg-muted">Channels</span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                {brief.channels.length > 0 ? (
                  brief.channels.map((ch) => (
                    <span key={ch} className="inline-flex items-center gap-1.5 font-serif text-copy text-fg">
                      <ChannelGlyph channel={ch} className="h-3.5 w-3.5 shrink-0" />
                      <span>{channelLabel(ch)}</span>
                    </span>
                  ))
                ) : (
                  <span className="font-serif text-copy text-fg">—</span>
                )}
              </div>
            </div>
            {brief.performanceFigures.length > 0 ? (
              <div className="flex flex-col gap-0.5 sm:col-span-2">
                <span className="font-sans text-label uppercase tracking-wider text-fg-muted">Performance figures</span>
                <span className="font-serif text-copy text-fg">
                  {brief.performanceFigures
                    .map((f) => (f.period ? `${f.value} (${f.period})` : f.value))
                    .join("; ")}
                </span>
              </div>
            ) : null}
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-baseline gap-3">
            <h2 className="font-sans text-label-strong uppercase tracking-wider text-fg-muted">
              Frozen rules ({ruleCount}) · {hash.length > 0 ? shortHash(hash) : "—"}
            </h2>
            <TertiaryLink onClick={onViewFreeze}>View</TertiaryLink>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-sans text-label-strong uppercase tracking-wider text-fg-muted">
            Assets in this campaign
          </h2>
          <div className="flex h-[220px] flex-col overflow-y-auto border-t border-hairline">
            {assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                className="grid cursor-pointer grid-cols-[100px_minmax(0,1.8fr)_minmax(0,1.2fr)] items-baseline gap-4 border-b border-hairline py-3 text-left hover:bg-hover"
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
                <span className="text-ui text-fg-muted">
                  {cleanPlural(asset.statusDetail)}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-auto pt-8">
        {allCleared ? (
          <div className="flex items-baseline justify-between border-t border-hairline pt-3">
            <span className="text-ui font-medium text-fg">
              All {assets.length} assets cleared — ready to ship.
            </span>
            <button
              type="button"
              className="cursor-pointer font-sans text-caption text-fg underline underline-offset-4 hover:text-primary"
              onClick={() => {
                void navigate("/assets");
              }}
            >
              View in Asset Register →
            </button>
          </div>
        ) : progress.length > 0 ? (
          <div className="border-t border-hairline pt-3">
            <p className="text-caption text-fg-muted">{cleanPlural(progress)}</p>
          </div>
        ) : null}
      </footer>
    </div>
  );
}
