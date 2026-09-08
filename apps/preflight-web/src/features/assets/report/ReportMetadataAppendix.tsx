/**
 * ReportMetadataAppendix — collapsed technical record at exhibit foot.
 * Why: hashes and provenance for forensic use, not the opening act (report UX plan).
 */

import type { ReactElement } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import type { ComplianceReportDTO } from "@preflight/schemas";

import { formatGeneratedAt } from "@/features/assets/lib";
import {
  reportGeneratorProvenance,
  reportIdentityCampaignLine,
} from "@/features/assets/report/report-lib";

export function ReportMetadataAppendix({
  report,
}: {
  report: ComplianceReportDTO;
}): ReactElement {
  return (
    <details className="group report-metadata-appendix border-t border-hairline py-6">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-sans text-label-strong uppercase tracking-[0.06em] text-fg-muted [&::-webkit-details-marker]:hidden">
        <ChevronRight
          className="size-3.5 shrink-0 group-open:hidden"
          aria-hidden
        />
        <ChevronDown
          className="size-3.5 hidden shrink-0 group-open:block"
          aria-hidden
        />
        Technical record
      </summary>
      <p className="mt-2 font-sans text-caption text-fg-muted">
        Hashes and generator details — included in JSON export.
      </p>
      <dl className="mt-3 flex flex-col gap-2 font-sans text-caption text-fg">
        <div>
          <dt className="text-fg-muted">Campaign</dt>
          <dd>{reportIdentityCampaignLine(report)}</dd>
        </div>
        <div>
          <dt className="text-fg-muted">Generated</dt>
          <dd>{formatGeneratedAt(report.generatedAt)}</dd>
        </div>
        <div>
          <dt className="text-fg-muted">Provenance</dt>
          <dd>{reportGeneratorProvenance(report)}</dd>
        </div>
        <div>
          <dt className="text-fg-muted">Hashes</dt>
          <dd className="font-mono text-mono-meta break-all">
            run {report.runHash}
            <br />
            ruleset {report.rulesetHash}
            <br />
            freeze {report.constraintSetId}
          </dd>
        </div>
      </dl>
    </details>
  );
}
