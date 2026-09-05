/**
 * BuiltSummary — S4 return-visit campaign summary with asset rows.
 * Why: only screen that answers whether the campaign set is ready to ship.
 */

import type { ReactElement, ReactNode } from "react";
import { ArrowRight, ClipboardList, Layers, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { AssetListItemDTO, CompileResponseDTO, StructuredBriefInput } from "@preflight/schemas";

import { ChannelGlyph } from "@/features/assets/ChannelGlyph";
import { channelLabel } from "@/features/assets/lib";
import { CampaignAssetRows } from "@/features/campaign/CampaignAssetRows";
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

function SectionHeading({
  children,
  icon,
}: {
  children: string;
  icon: ReactNode;
}): ReactElement {
  return (
    <h2 className="inline-flex items-center gap-2 font-sans text-label-strong uppercase tracking-wider text-fg-muted">
      <span className="shrink-0 text-fg-muted" aria-hidden>
        {icon}
      </span>
      {children}
    </h2>
  );
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
      className="cursor-pointer font-sans text-[11px] text-fg-muted underline underline-offset-4 hover:text-fg"
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
            <SectionHeading icon={<ClipboardList className="size-3.5" />}>
              Brief summary
            </SectionHeading>
            <TertiaryLink onClick={onEditBrief}>Edit brief</TertiaryLink>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 border border-hairline bg-surface p-4 sm:grid-cols-2">
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
                Objective
              </span>
              <span className="font-serif text-copy text-fg">
                {brief.objective || "—"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
                Scheme
              </span>
              <span className="font-serif text-copy text-fg">
                {brief.schemeName} ({brief.schemeCategory})
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
                Audience & Market
              </span>
              <span className="font-serif text-copy text-fg">
                {brief.audience} · {brief.market}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
                Channels
              </span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                {brief.channels.length > 0 ? (
                  brief.channels.map((ch) => (
                    <span
                      key={ch}
                      className="inline-flex items-center gap-1.5 font-serif text-copy text-fg"
                    >
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
                <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
                  Performance figures
                </span>
                <span className="font-serif text-copy text-fg">
                  {brief.performanceFigures
                    .map((f) => (f.period ? `${f.value} (${f.period})` : f.value))
                    .join("; ")}
                </span>
              </div>
            ) : null}
          </div>
        </section>

        <div className="flex items-baseline gap-3">
          <span className="inline-flex items-center gap-2 font-sans text-label-strong uppercase tracking-wider text-fg-muted">
            <Lock className="size-3.5 shrink-0 text-fg-muted" aria-hidden="true" />
            {`Frozen rules (${ruleCount}) · ${hash.length > 0 ? shortHash(hash) : "—"}`}
          </span>
          <TertiaryLink onClick={onViewFreeze}>View</TertiaryLink>
        </div>

        <section className="flex flex-col gap-3">
          <SectionHeading icon={<Layers className="size-3.5" />}>
            Assets in this campaign
          </SectionHeading>
          <CampaignAssetRows assets={assets} />
        </section>
      </div>

      <footer className="mt-auto border-t border-hairline pt-4">
        {allCleared ? (
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-ui font-medium text-fg">
              All {assets.length} assets cleared — ready to ship.
            </span>
            <button
              type="button"
              className="inline-flex shrink-0 cursor-pointer items-center gap-1 font-sans text-[11px] text-fg underline underline-offset-4 hover:text-primary"
              onClick={() => {
                void navigate("/assets");
              }}
            >
              View in Asset Register
              <ArrowRight className="size-3 shrink-0" aria-hidden="true" />
            </button>
          </div>
        ) : progress.length > 0 ? (
          <p className="text-ui font-medium text-fg">{cleanPlural(progress)}</p>
        ) : null}
      </footer>
    </div>
  );
}
