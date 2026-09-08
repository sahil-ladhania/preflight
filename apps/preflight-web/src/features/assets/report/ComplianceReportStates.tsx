/**
 * ComplianceReportStates — loading, error, and not-found for exhibit route.
 * Why: mirrors asset detail shells without review chrome.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { ReportChrome } from "@/features/assets/report/ReportChrome";

function ReportShell({ children }: { children: ReactElement }): ReactElement {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-ground">
      {children}
    </div>
  );
}

export function ReportLoadingState({
  showSpinner,
}: {
  showSpinner: boolean;
}): ReactElement {
  return (
    <ReportShell>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="h-topbar shrink-0 border-b border-hairline bg-surface" />
        <div className="flex flex-1 items-center justify-center">
          {showSpinner ? (
            <span className="pending-ring" aria-label="Loading report" />
          ) : null}
        </div>
      </div>
    </ReportShell>
  );
}

export function ReportErrorState({
  onRetry,
}: {
  onRetry?: () => void;
}): ReactElement {
  return (
    <ReportShell>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4">
        <p className="text-caption text-fg-muted">Could not load compliance record.</p>
        {onRetry !== undefined ? (
          <Button type="button" variant="outline" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    </ReportShell>
  );
}

export function ReportNotFoundState(): ReactElement {
  return (
    <ReportShell>
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <p className="text-caption text-fg-muted">Asset not found</p>
      </div>
    </ReportShell>
  );
}

export function ReportLoadedShell({
  assetId,
  headline,
  status,
  onDownload,
  downloadInFlight,
  children,
}: {
  assetId: string;
  headline: string;
  status: Parameters<typeof ReportChrome>[0]["status"];
  onDownload: () => void;
  downloadInFlight: boolean;
  children: ReactElement;
}): ReactElement {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-ground">
      <ReportChrome
        assetId={assetId}
        headline={headline}
        status={status}
        onDownload={onDownload}
        downloadInFlight={downloadInFlight}
      />
      <div className="min-h-0 flex-1 overflow-auto bg-ground">{children}</div>
    </div>
  );
}
