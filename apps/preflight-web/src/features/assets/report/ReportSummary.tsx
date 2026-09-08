/**
 * ReportSummary — cover verdict and check counts for the compliance exhibit.
 * Why: auditor sees status and scope before evidence (report UX plan).
 */

import type { ReactElement } from "react";

import type { ComplianceReportDTO } from "@preflight/schemas";

import {
  channelLabel,
  formatGeneratedAt,
  shortId,
} from "@/features/assets/lib";
import {
  reportCheckSummary,
  reportStatusClosingSentence,
} from "@/features/assets/report/report-lib";
import { StatusChip } from "@/features/assets/StatusChip";

function SummaryCount({
  value,
  label,
}: {
  value: number;
  label: string;
}): ReactElement {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="font-mono text-mono-meta text-fg">{value}</span>
      <span className="font-sans text-caption text-fg-muted">{label}</span>
    </span>
  );
}

export function ReportSummary({
  report,
}: {
  report: ComplianceReportDTO;
}): ReactElement {
  const closing = reportStatusClosingSentence(report.status, report.findings);
  const summary = reportCheckSummary(report.findings);
  const versionLabel =
    report.generationIndex > 1 ? `v${report.generationIndex}` : "v1";

  return (
    <header className="border-b border-fg pb-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="font-sans text-label-strong uppercase tracking-[0.06em] text-fg-muted">
          Compliance record
        </p>
        <StatusChip status={report.status} surface="detail" />
      </div>
      <h1 className="mt-3 font-serif text-subject-title text-fg">
        {report.headline}
      </h1>
      <p className="mt-3 font-serif text-copy text-fg">{closing}</p>
      <p className="mt-2 font-mono text-mono-meta text-fg-muted">
        {channelLabel(report.channel)} · {shortId(report.id)} · {versionLabel}
      </p>
      <p className="mt-1 font-sans text-caption text-fg-muted">
        Exported {formatGeneratedAt(report.exportedAt)}
      </p>
      <div
        className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border border-hairline bg-ground px-3 py-2"
        aria-label="Check summary"
      >
        <SummaryCount value={summary.total} label="checks" />
        <span className="text-fg-faint select-none" aria-hidden>
          ·
        </span>
        <SummaryCount value={summary.passed} label="passed" />
        <span className="text-fg-faint select-none" aria-hidden>
          ·
        </span>
        <SummaryCount value={summary.failed} label="failed" />
        {summary.waived > 0 ? (
          <>
            <span className="text-fg-faint select-none" aria-hidden>
              ·
            </span>
            <SummaryCount value={summary.waived} label="exceptions" />
          </>
        ) : null}
        {summary.open > 0 ? (
          <>
            <span className="text-fg-faint select-none" aria-hidden>
              ·
            </span>
            <SummaryCount value={summary.open} label="open" />
          </>
        ) : null}
      </div>
      <p className="mt-4 font-sans text-caption text-fg-muted leading-relaxed">
        This is the frozen proof for this asset. It is not the live rulebook. It
        is not a SEBI filing.
      </p>
    </header>
  );
}
