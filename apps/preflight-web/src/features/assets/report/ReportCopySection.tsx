/**
 * ReportCopySection — read-only copy with fail span underlines.
 * Why: exhibit proof surface; no preview or interaction (plan §Ideal interface).
 */

import type { ReactElement } from "react";

import type { ComplianceReportDTO, FindingDTO } from "@preflight/schemas";

import { buildCopySegments } from "@/features/assets/span-highlight";
import type { CopySegments, SpanSegment } from "@/features/assets/types";
import { findingById, isFailFinding } from "@/features/assets/lib";

const FIELD_LABELS: Array<{ key: keyof CopySegments; label: string }> = [
  { key: "headline", label: "Headline" },
  { key: "body", label: "Body" },
  { key: "disclaimer", label: "Disclaimer" },
  { key: "cta", label: "CTA" },
];

function segmentText(segments: SpanSegment[]): string {
  return segments.map((segment) => segment.text).join("");
}

function ReportCopyField({
  label,
  segments,
  findings,
}: {
  label: string;
  segments: SpanSegment[];
  findings: FindingDTO[];
}): ReactElement {
  const text = segmentText(segments);
  const isEmpty = text.trim().length === 0;

  return (
    <div className="flex flex-col gap-1.5 border-b border-hairline py-3 last:border-b-0">
      <p className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
        {label}
      </p>
      {isEmpty ? (
        <p className="font-serif text-copy italic text-fg-faint">(empty)</p>
      ) : (
        <p className="font-serif text-copy leading-relaxed text-fg">
          {segments.map((segment, index) => {
            if (segment.findingId === null) {
              return <span key={index}>{segment.text}</span>;
            }
            const finding = findingById(findings, segment.findingId);
            if (finding === undefined || !isFailFinding(finding)) {
              return <span key={index}>{segment.text}</span>;
            }
            return (
              <span key={index} className="span-fail cursor-default">
                {segment.text}
              </span>
            );
          })}
        </p>
      )}
    </div>
  );
}

export function ReportCopySection({
  report,
}: {
  report: ComplianceReportDTO;
}): ReactElement {
  const copySegments = buildCopySegments(report);

  return (
    <section className="flex flex-col">
      {FIELD_LABELS.map(({ key, label }) => (
        <ReportCopyField
          key={key}
          label={label}
          segments={copySegments[key]}
          findings={report.findings}
        />
      ))}
    </section>
  );
}
