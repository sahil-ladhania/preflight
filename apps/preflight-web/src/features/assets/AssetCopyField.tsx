/**
 * AssetCopyField — labeled copy field with span paint.
 * Why: extracted from AssetPane for file size + preview layout.
 */

import type { ReactElement } from "react";
import {
  AlignLeft,
  MousePointerClick,
  ShieldCheck,
  Type,
  type LucideIcon,
} from "lucide-react";

import type { FindingDTO } from "@preflight/schemas";

import type { SpanSegment } from "@/features/assets/types";
import { findingById, isFailFinding } from "@/features/assets/lib";
import { cn } from "@/lib/utils";

const COPY_FIELD_ICONS: Record<string, LucideIcon> = {
  Headline: Type,
  Body: AlignLeft,
  Disclaimer: ShieldCheck,
  CTA: MousePointerClick,
};

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
  const Icon = COPY_FIELD_ICONS[label];

  return (
    <div className="flex flex-col gap-1.5 py-2">
      <p className="inline-flex items-center gap-1.5 font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
        {Icon !== undefined ? (
          <Icon className="size-3.5 shrink-0" aria-hidden />
        ) : null}
        {label}
      </p>
      {isEmpty ? (
        <p className="font-serif text-copy italic text-fg-faint">(empty)</p>
      ) : (
        <p className={cn("font-serif text-copy leading-relaxed text-fg", contentClass)}>
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
