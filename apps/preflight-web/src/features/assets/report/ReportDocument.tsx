/**
 * ReportDocument — 720px compliance exhibit body.
 * Why: auditor-first section order — verdict, copy, material findings, appendix.
 */

import type { ReactElement, ReactNode } from "react";

import type { ComplianceReportDTO } from "@preflight/schemas";

import { ReportCopySection } from "@/features/assets/report/ReportCopySection";
import { ReportFinding } from "@/features/assets/report/ReportFinding";
import { ReportMetadataAppendix } from "@/features/assets/report/ReportMetadataAppendix";
import { ReportPassesTable } from "@/features/assets/report/ReportPassesTable";
import { ReportSummary } from "@/features/assets/report/ReportSummary";
import { partitionFindingsForReport } from "@/features/assets/report/report-lib";

function SectionHeading({ children }: { children: ReactNode }): ReactElement {
  return (
    <h2 className="font-sans text-label-strong uppercase tracking-[0.06em] text-fg-muted">
      {children}
    </h2>
  );
}

export function ReportDocument({
  report,
}: {
  report: ComplianceReportDTO;
}): ReactElement {
  const { material, passes } = partitionFindingsForReport(report.findings);

  return (
    <article className="mx-auto w-full max-w-[720px] px-6 py-8 print:max-w-none print:px-0">
      <ReportSummary report={report} />

      <section className="border-b border-hairline py-6">
        <SectionHeading>The copy</SectionHeading>
        <div className="mt-3 border border-hairline bg-surface px-4">
          <ReportCopySection report={report} />
        </div>
      </section>

      {material.length > 0 ? (
        <section className="border-b border-hairline py-6">
          <SectionHeading>Findings — {material.length} rules</SectionHeading>
          <div className="mt-3 flex flex-col gap-3">
            {material.map((finding) => (
              <ReportFinding key={finding.id} finding={finding} />
            ))}
          </div>
        </section>
      ) : null}

      <ReportPassesTable passes={passes} />

      <ReportMetadataAppendix report={report} />
    </article>
  );
}
