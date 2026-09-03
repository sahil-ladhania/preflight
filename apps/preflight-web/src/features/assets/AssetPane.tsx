/**
 * AssetPane — R3 left evidence pane with preview and copy fields.
 * Why: preview frame above audit copy fields (09 R3c–R3e).
 */

import type { ReactElement } from "react";

import { AgentRunBadge } from "@/features/assets/AgentRunBadge";
import { AssetActionRow } from "@/features/assets/AssetActionRow";
import { AssetCopyField } from "@/features/assets/AssetCopyField";
import { ChannelPreviewSection } from "@/features/assets/ChannelPreviewSection";
import { RerunStrip } from "@/features/assets/RerunStrip";
import type { AssetPaneProps, CopySegments } from "@/features/assets/types";

export function AssetPane({
  asset,
  openFindingId,
  onSpanClick,
  onAccept,
  onRegenerate,
  onExport,
  exportInFlight = false,
  regenerateInFlight = false,
  rerunStrip,
  onRerun,
  rerunInFlight = false,
}: AssetPaneProps): ReactElement {
  const renderCopy = (
    segments: CopySegments[keyof CopySegments],
    label: string,
  ): ReactElement => (
    <AssetCopyField
      label={label}
      segments={segments}
      contentClass="font-serif text-copy text-fg"
      findings={asset.findings}
      openFindingId={openFindingId}
      onSpanClick={onSpanClick}
    />
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-8 pb-12 pt-6">
      <div className="flex flex-col gap-6">
        <AssetActionRow
          status={asset.status}
          findingsCount={asset.findings.length}
          onAccept={onAccept}
          onRegenerate={onRegenerate}
          onExport={onExport}
          exportInFlight={exportInFlight}
          regenerateInFlight={regenerateInFlight}
        />
        <AgentRunBadge run={asset.generatorRun} />
        <ChannelPreviewSection
          channel={asset.channel}
          headline={asset.headline}
          body={asset.body}
          disclaimer={asset.disclaimer}
          cta={asset.cta}
          brandKit={asset.brandKit}
        />
        <div className="flex flex-col gap-4">
          {renderCopy(asset.copySegments.headline, "Headline")}
          {renderCopy(asset.copySegments.body, "Body")}
          {renderCopy(asset.copySegments.disclaimer, "Disclaimer")}
          {renderCopy(asset.copySegments.cta, "CTA")}
        </div>
        <RerunStrip
          strip={rerunStrip}
          onRerun={onRerun}
          rerunInFlight={rerunInFlight}
        />
      </div>
    </div>
  );
}
