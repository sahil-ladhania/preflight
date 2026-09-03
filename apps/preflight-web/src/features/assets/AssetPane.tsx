/**
 * AssetPane — R3 left copy pane with channel preview.
 * Why: preview frame above audit copy fields (doc 19 §8.4).
 */

import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChannelBadge } from "@/features/assets/ChannelBadge";
import { AgentRunBadge } from "@/features/assets/AgentRunBadge";
import { AssetCopyField } from "@/features/assets/AssetCopyField";
import { ChannelPreview } from "@/features/assets/previews/ChannelPreview";
import {
  acceptDisabledCaption,
  acceptIsEnabled,
  countPending,
  formatGeneratedAt,
  shortId,
} from "@/features/assets/lib";
import { PendingRing } from "@/features/assets/PendingRing";
import type { AssetPaneProps, CopySegments } from "@/features/assets/types";
import { StatusChip } from "@/features/assets/StatusChip";

export function AssetPane({
  asset,
  openFindingId,
  onSpanClick,
  onAccept,
  onRegenerate,
  onExport,
  exportInFlight = false,
  regenerateInFlight = false,
  suppressHeaderActions = false,
}: AssetPaneProps): ReactElement {
  const acceptEnabled = acceptIsEnabled(asset.status);
  const disabledCaption = acceptDisabledCaption(
    asset.status,
    asset.findings.length,
  );
  const pendingCount = countPending(asset.findings);

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
    <div className="flex h-full min-h-0 flex-col overflow-y-auto rounded-md border border-border bg-surface">
      <div className="flex flex-col gap-2 border-b border-border px-4 py-2">
        <div className="flex flex-wrap items-center gap-3">
          <StatusChip status={asset.status} />
          <PendingRing active={pendingCount > 0} />
          {asset.generationIndex > 1 ? (
            <span className="text-mono text-caption text-fg-muted">
              v{asset.generationIndex}
            </span>
          ) : null}
          <span className="text-caption text-fg-muted">
            {formatGeneratedAt(asset.generatedAt)}
          </span>
          <span className="text-hash text-fg-muted">{shortId(asset.id)}</span>
        </div>
        <AgentRunBadge run={asset.generatorRun} />
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-end gap-2">
            {!suppressHeaderActions ? (
              <>
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
              </>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="h-8 rounded-md px-4"
              disabled={exportInFlight}
              onClick={onExport}
            >
              {exportInFlight ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                "Export compliance report"
              )}
            </Button>
          </div>
          {!suppressHeaderActions && !acceptEnabled && disabledCaption !== null ? (
            <p className="text-caption text-fg-muted">{disabledCaption}</p>
          ) : null}
        </div>
      </div>
      <div className="border-b border-border px-4 py-3">
        <div className="mb-2">
          <ChannelBadge channel={asset.channel} showLabel />
        </div>
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
