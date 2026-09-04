/**
 * AssetArtefactPane — Middle column (Column 2: THE ARTEFACT).
 * Why: canonical copy under judgement; preview is contained (09 Screen 1 R3).
 */

import { useState, type ReactElement } from "react";

import { AssetCopyField } from "@/features/assets/AssetCopyField";
import { ChannelPreview } from "@/features/assets/previews/ChannelPreview";
import type { AssetDetailFixture } from "@/features/assets/types";
import { cn } from "@/lib/utils";

export interface AssetArtefactPaneProps {
  asset: AssetDetailFixture;
  openFindingId: string | null;
  onSpanClick: (findingId: string) => void;
}

export function AssetArtefactPane({
  asset,
  openFindingId,
  onSpanClick,
}: AssetArtefactPaneProps): ReactElement {
  const [activeTab, setActiveTab] = useState<"copy" | "preview">("copy");

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden border-r border-hairline bg-surface">
      {/* Header: Segmented Control (Copy | Preview) */}
      <div className="flex shrink-0 items-center justify-between border-b border-hairline bg-surface px-6 py-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={cn(
              "cursor-pointer border border-fg px-3 py-1 font-sans text-xs",
              activeTab === "copy"
                ? "font-semibold text-fg"
                : "font-normal text-fg-muted hover:text-fg",
            )}
            onClick={() => setActiveTab("copy")}
          >
            Copy
          </button>
          <button
            type="button"
            className={cn(
              "cursor-pointer border border-fg px-3 py-1 font-sans text-xs",
              activeTab === "preview"
                ? "font-semibold text-fg"
                : "font-normal text-fg-muted hover:text-fg",
            )}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>
        <span className="font-mono text-mono-meta text-fg-muted uppercase">
          {asset.channel}
        </span>
      </div>

      {/* Main Artefact Body */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-5">
        {activeTab === "copy" ? (
          <div className="flex flex-col gap-4">
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
            <AssetCopyField
              label="Disclaimer"
              segments={asset.copySegments.disclaimer}
              contentClass=""
              findings={asset.findings}
              openFindingId={openFindingId}
              onSpanClick={onSpanClick}
            />
            <AssetCopyField
              label="CTA"
              segments={asset.copySegments.cta}
              contentClass=""
              findings={asset.findings}
              openFindingId={openFindingId}
              onSpanClick={onSpanClick}
            />
          </div>
        ) : (
          <div className="border border-hairline bg-preview-stage p-6">
            <div className="mx-auto max-w-[340px] bg-preview-card p-4">
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
        )}

        {/* Page termination line per 08 §4.5 */}
        <div className="mt-auto pt-6">
          <div className="border-t border-fg pt-2">
            <p className="font-sans text-label-strong uppercase tracking-[0.06em] text-fg-muted text-[10px]">
              Artefact · {activeTab === "copy" ? "4 copy fields" : "channel preview"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
