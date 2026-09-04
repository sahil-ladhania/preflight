/**
 * AssetCopyField — labeled copy field with span paint.
 * Why: extracted from AssetPane for file size + preview layout.
 */

import type { ReactElement } from "react";

import type { FindingDTO } from "@preflight/schemas";

import type { SpanSegment } from "@/features/assets/types";
import { findingById, isFailFinding } from "@/features/assets/lib";
import { cn } from "@/lib/utils";

function segmentText(segments: SpanSegment[]): string {
  return segments.map((segment) => segment.text).join("");
}

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

export function AssetCopyField({
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
  const text = segmentText(segments);
  const isEmpty = text.trim().length === 0;

  return (
    <div className="flex flex-col gap-1.5 border border-border bg-surface p-3.5 shadow-none">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-fg-muted">
          {label}
        </p>
      </div>
      {isEmpty ? (
        <p className="font-serif text-copy italic text-fg-faint">(empty)</p>
      ) : (
        <p className={cn(contentClass, "leading-relaxed")}>
          {segments.map((segment, index) => {
            if (segment.findingId === null) {
              return <span key={index}>{segment.text}</span>;
            }
            const finding = findingById(findings, segment.findingId);
            const mark = spanClassName(
              finding,
              openFindingId === segment.findingId,
            );
            if (mark === null) {
              return <span key={index}>{segment.text}</span>;
            }
            return (
              <span
                key={index}
                role="button"
                tabIndex={0}
                data-finding-span={segment.findingId}
                className={cn(mark, "cursor-pointer")}
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
      )}
    </div>
  );
}
