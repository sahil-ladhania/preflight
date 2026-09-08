/**
 * ComplianceReportRoute — wired /assets/:id/report entry.
 * Why: full-bleed exhibit outside ShellFrame (plan route-hook).
 */

import type { ReactElement } from "react";
import { useParams } from "react-router-dom";

import { ComplianceReport } from "@/features/assets/report/ComplianceReport";
import {
  ReportErrorState,
  ReportLoadingState,
  ReportNotFoundState,
} from "@/features/assets/report/ComplianceReportStates";
import { useComplianceReport } from "@/features/assets/report/useComplianceReport";

export function ComplianceReportRoute(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const {
    report,
    view,
    notFound,
    showLoadingSpinner,
    retryLoad,
    downloadReport,
    downloadInFlight,
  } = useComplianceReport(id);

  if (notFound) {
    return <ReportNotFoundState />;
  }

  if (view === "loading") {
    return <ReportLoadingState showSpinner={showLoadingSpinner} />;
  }

  if (view === "error" || report === null) {
    return <ReportErrorState onRetry={retryLoad} />;
  }

  return (
    <ComplianceReport
      report={report}
      onDownload={downloadReport}
      downloadInFlight={downloadInFlight}
    />
  );
}
