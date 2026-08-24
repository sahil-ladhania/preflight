/**
 * AssetPane — R3 left copy pane.
 * Why: renders copy and span paint segments.
 */

import type { ReactElement } from "react";

import type { FindingDTO } from "@preflight/schemas";

import { Button } from "@/components/ui/button";
import type { AssetPaneProps, CopySegments, SpanSegment } from "@/features/assets/types";
import {
  acceptDisabledCaption,
  acceptIsEnabled,
  findingById,
  formatGeneratedAt,
  isFailFinding,
  shortId,
} from "@/features/assets/lib";
import { StatusChip } from "@/features/assets/StatusChip";
import { cn } from "@/lib/utils";

function spanClassName(
  finding: FindingDTO | undefined,
  selected: boolean,
): string | null {
  if (finding === undefined || !isFailFinding(finding)) {
    return null;
  }
  if (finding.humanVerdict === "overridden") {
    return cn("span-overridden", selected && "span-fail-selected");
  }
  if (finding.humanVerdict === "waived") {
    return cn("span-waived-fail", selected && "span-fail-selected");
  }
  return cn("span-fail", selected && "span-fail-selected");
}

function CopyField({
  label,
  segments,
  contentClass,
  findings,
  openFindingId,
  onSpanClick,
}: {
  label: string;
  segments: SpanSegment[];
  contentClass: string;
  findings: FindingDTO[];
  openFindingId: string | null;
  onSpanClick: (findingId: string) => void;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1 px-4 py-2">
      <p className="text-caption text-fg-muted">{label}</p>
      <p className={contentClass}>
        {segments.map((segment, index) => {
          if (segment.findingId === null) {
            return <span key={index}>{segment.text}</span>;
          }
          const finding = findingById(findings, segment.findingId);
          const mark = spanClassName(finding, openFindingId === segment.findingId);
          if (mark === null) {
            return <span key={index}>{segment.text}</span>;
          }
          return (
            <span
              key={index}
              role="button"
              tabIndex={0}
              className={mark}
              onClick={() => onSpanClick(segment.findingId as string)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSpanClick(segment.findingId as string);
                }
              }}
            >
              {segment.text}
            </span>
          );
        })}
      </p>
    </div>
  );
}

export function AssetPane({
  asset,
  openFindingId,
  onSpanClick,
  onAccept,
  onRegenerate,
}: AssetPaneProps): ReactElement {
  const acceptEnabled = acceptIsEnabled(asset.status);
  const disabledCaption = acceptDisabledCaption(
    asset.status,
    asset.findings.length,
  );

  const handleRegenerate = (): void => {
    // Will POST /campaigns/:campaignId/generate with regeneratedFromId.
    onRegenerate();
  };

  const renderCopy = (
    segments: CopySegments[keyof CopySegments],
    label: string,
    contentClass: string,
  ): ReactElement => (
    <CopyField
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
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2">
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
          {acceptEnabled ? (
            <Button type="button" className="h-8 rounded-md px-4" onClick={onAccept}>
              Accept
            </Button>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <Button type="button" variant="outline" className="h-8 rounded-md px-4" disabled>
                Accept
              </Button>
              {disabledCaption !== null ? (
                <span className="text-caption text-fg-muted">{disabledCaption}</span>
              ) : null}
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-md px-4"
            onClick={handleRegenerate}
          >
            Regenerate
          </Button>
        </div>
      </div>
      {renderCopy(asset.copySegments.headline, "Headline", "text-title text-fg")}
      {renderCopy(asset.copySegments.body, "Body", "text-body text-fg")}
      {renderCopy(asset.copySegments.disclaimer, "Disclaimer", "text-body text-fg")}
      {renderCopy(asset.copySegments.cta, "CTA", "text-body text-fg")}
    </div>
  );
}
