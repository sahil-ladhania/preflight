/**
 * AssetPane — R3 left copy pane with channel preview.
 * Why: preview frame above audit copy fields (doc 19 §8.4).
 */

import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AssetCopyField } from "@/features/assets/AssetCopyField";
import { ChannelPreview } from "@/features/assets/previews/ChannelPreview";
import type { AssetPaneProps, CopySegments } from "@/features/assets/types";
import {
  acceptDisabledCaption,
  acceptIsEnabled,
  formatGeneratedAt,
  shortId,
} from "@/features/assets/lib";
import { StatusChip } from "@/features/assets/StatusChip";

export function AssetPane({
  asset,
  openFindingId,
  onSpanClick,
  onAccept,
  onRegenerate,
  regenerateInFlight = false,
}: AssetPaneProps): ReactElement {
  const acceptEnabled = acceptIsEnabled(asset.status);
  const disabledCaption = acceptDisabledCaption(
    asset.status,
    asset.findings.length,
  );

  const renderCopy = (
    segments: CopySegments[keyof CopySegments],
    label: string,
    contentClass: string,
  ): ReactElement => (
    <AssetCopyField
      label={label}
      segments={segments}
      contentClass={contentClass}
      findings={asset.findings}
      openFindingId={openFindingId}
      onSpanClick={onSpanClick}
    />
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto rounded-md border border-border bg-canvas">
      <div className="border-b border-border px-4 py-2">
        <div className="flex flex-wrap items-center gap-3">
          <StatusChip status={asset.status} />
          {asset.generationIndex > 1 ? (
            <span className="text-mono text-caption text-fg-muted">
              v{asset.generationIndex}
            </span>
          ) : null}
          <span className="text-caption text-fg-muted">
            {formatGeneratedAt(asset.generatedAt)}
          </span>
          <span className="text-hash text-fg-muted">{shortId(asset.id)}</span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant={acceptEnabled ? "default" : "outline"}
              className="h-8 rounded-md px-4"
              disabled={!acceptEnabled}
              onClick={acceptEnabled ? onAccept : undefined}
            >
              Ready for compliance desk
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-8 rounded-md px-4"
              disabled={regenerateInFlight}
              onClick={onRegenerate}
            >
              {regenerateInFlight ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                "Regenerate"
              )}
            </Button>
          </div>
        </div>
        {!acceptEnabled && disabledCaption !== null ? (
          <p className="mt-1 text-right text-caption text-fg-muted">
            {disabledCaption}
          </p>
        ) : null}
      </div>
      <div className="border-b border-border px-4 py-3">
        <p className="mb-2 text-caption text-fg-muted">Channel preview</p>
        <ChannelPreview
          channel={asset.channel}
          headline={asset.headline}
          body={asset.body}
          disclaimer={asset.disclaimer}
          cta={asset.cta}
          brandKit={asset.brandKit}
        />
      </div>
      {renderCopy(asset.copySegments.headline, "Headline", "text-title text-fg")}
      {renderCopy(asset.copySegments.body, "Body", "text-body text-fg")}
      {renderCopy(asset.copySegments.disclaimer, "Disclaimer", "text-body text-fg")}
      {renderCopy(asset.copySegments.cta, "CTA", "text-body text-fg")}
    </div>
  );
}
