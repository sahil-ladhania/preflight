/**
 * AssetArtefactPane — Middle column (Column 2: THE ARTEFACT).
 * Why: canonical copy under judgement; preview is contained (09 Screen 1 R3).
 */

import { useState, type ReactElement } from "react";
import { FileText } from "lucide-react";

import { ButtonGroup } from "@/components/ui/button-group";
import { AssetCopyField } from "@/features/assets/AssetCopyField";
import { ChannelPreview } from "@/features/assets/previews/ChannelPreview";
import type { AssetDetailFixture } from "@/features/assets/types";
import { cn } from "@/lib/utils";

export interface AssetArtefactPaneProps {
  asset: AssetDetailFixture;
  openFindingId: string | null;
  onSpanClick: (findingId: string) => void;
  regenerateInFlight?: boolean;
}

export function AssetArtefactPane({
  asset,
  openFindingId,
  onSpanClick,
  regenerateInFlight = false,
}: AssetArtefactPaneProps): ReactElement {
  const [activeTab, setActiveTab] = useState<"copy" | "preview">("copy");

  return (
    <div className="flex h-full min-h-0 w-[46%] shrink-0 flex-col overflow-hidden border-r border-fg bg-surface">
      {/* Main Artefact Body */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-4 pb-5">
        {/* Column 2 Horizon Header: Label left, toggle right */}
        <div className="flex h-7 shrink-0 items-center justify-between">
          <span className="inline-flex items-center gap-1.5 font-sans text-label-strong uppercase tracking-[0.06em] text-fg-muted">
            <FileText className="size-3.5 shrink-0" aria-hidden />
            Artefact
          </span>
          <ButtonGroup className="rounded-none">
            <button
              type="button"
              className={cn(
                "cursor-pointer rounded-none border border-fg px-3 py-0.5 font-sans text-xs shadow-none",
                activeTab === "copy"
                  ? "bg-fg text-surface font-medium"
                  : "bg-transparent font-normal text-fg-muted hover:text-fg",
              )}
              onClick={() => setActiveTab("copy")}
            >
              Copy
            </button>
            <button
              type="button"
              className={cn(
                "cursor-pointer rounded-none border border-fg px-3 py-0.5 font-sans text-xs shadow-none",
                activeTab === "preview"
                  ? "bg-fg text-surface font-medium"
                  : "bg-transparent font-normal text-fg-muted hover:text-fg",
              )}
              onClick={() => setActiveTab("preview")}
            >
              Preview
            </button>
          </ButtonGroup>
        </div>

        <div
          className={cn(
            "mt-4 flex-1",
            activeTab === "preview" && "flex min-h-0 flex-col",
          )}
        >
          {regenerateInFlight ? (
            <div className="flex max-w-[65ch] flex-col">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
                    Headline
                  </span>
                  <div className="h-7 w-full regenerate-shimmer" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
                    Body
                  </span>
                  <div className="h-[72px] w-full regenerate-shimmer" />
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-1 border-t border-hairline/40 pt-4">
                <span className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
                  Disclaimer
                </span>
                <div className="h-12 w-full regenerate-shimmer" />
              </div>
              <div className="mt-3 flex flex-col gap-1">
                <span className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
                  CTA
                </span>
                <div className="h-6 w-1/3 regenerate-shimmer" />
              </div>
            </div>
          ) : activeTab === "copy" ? (
            <div className="flex max-w-[65ch] flex-col">
              {/* Core creative claims: Headline and Body grouped closely */}
              <div className="flex flex-col gap-3">
                <AssetCopyField
                  label="Headline"
                  segments={asset.copySegments.headline}
                  contentClass=""
                  findings={asset.findings}
                  openFindingId={openFindingId}
                  onSpanClick={onSpanClick}
                />
                <AssetCopyField
                  label="Body"
                  segments={asset.copySegments.body}
                  contentClass=""
                  findings={asset.findings}
                  openFindingId={openFindingId}
                  onSpanClick={onSpanClick}
                />
              </div>

              {/* Regulatory boilerplate: separated deliberately */}
              <div className="mt-5 border-t border-hairline/40 pt-4">
                <AssetCopyField
                  label="Disclaimer"
                  segments={asset.copySegments.disclaimer}
                  contentClass=""
                  findings={asset.findings}
                  openFindingId={openFindingId}
                  onSpanClick={onSpanClick}
                />
              </div>

              {/* Terminal CTA fragment */}
              <div className="mt-3">
                <AssetCopyField
                  label="CTA"
                  segments={asset.copySegments.cta}
                  contentClass=""
                  findings={asset.findings}
                  openFindingId={openFindingId}
                  onSpanClick={onSpanClick}
                />
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-hairline bg-preview-stage p-6">
              <div className="flex min-h-0 flex-1 flex-col items-center justify-start overflow-y-auto">
                <div className="w-full max-w-[420px] border border-hairline bg-preview-card p-5 shadow-none">
                  <ChannelPreview
                    channel={asset.channel}
                    headline={asset.headline}
                    body={asset.body}
                    disclaimer={asset.disclaimer}
                    cta={asset.cta}
                    brandKit={asset.brandKit}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
