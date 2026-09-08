/**
 * ComplianceReport — exhibit orchestrator.
 * Why: read-only document face for ComplianceReportDTO (product.md audit trail).
 */

import type { ReactElement } from "react";

import type { ComplianceReportDTO } from "@preflight/schemas";

import {
  ReportLoadedShell,
} from "@/features/assets/report/ComplianceReportStates";
import { ReportDocument } from "@/features/assets/report/ReportDocument";

export interface ComplianceReportProps {
  report: ComplianceReportDTO;
  onDownload: () => void;
  downloadInFlight?: boolean;
}

export function ComplianceReport({
  report,
  onDownload,
  downloadInFlight = false,
}: ComplianceReportProps): ReactElement {
  return (
    <ReportLoadedShell
      assetId={report.id}
      headline={report.headline}
      status={report.status}
      onDownload={onDownload}
      downloadInFlight={downloadInFlight}
    >
      <ReportDocument report={report} />
    </ReportLoadedShell>
  );
}
