/**
 * useComplianceReport — GET /assets/:id/report for the exhibit page.
 * Why: read-only record fetch; no mutations on this route.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import type { ComplianceReportDTO } from "@preflight/schemas";

import { getAssetReportService } from "@/features/assets/assets.service";
import {
  complianceReportFilename,
  downloadJson,
} from "@/features/assets/lib";
import type { AssetDetailView } from "@/features/assets/types";
import { useDelayedLoading } from "@/features/shell/useDelayedLoading";
import { useToastContext } from "@/features/shell/ToastHost";
import { ApiClientError } from "@/lib/api";

export function useComplianceReport(id: string | undefined): {
  report: ComplianceReportDTO | null;
  view: AssetDetailView;
  notFound: boolean;
  showLoadingSpinner: boolean;
  retryLoad: () => void;
  downloadReport: () => void;
  downloadInFlight: boolean;
} {
  const [report, setReport] = useState<ComplianceReportDTO | null>(null);
  const [view, setView] = useState<AssetDetailView>("loading");
  const [notFound, setNotFound] = useState<boolean>(false);
  const [downloadInFlight, setDownloadInFlight] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);
  const { enqueue } = useToastContext();
  const showLoadingSpinner = useDelayedLoading(view === "loading");

  const load = useCallback(async (): Promise<void> => {
    if (id === undefined) {
      setNotFound(true);
      setView("error");
      setReport(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await getAssetReportService(id, controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      setReport(data);
      setNotFound(false);
      setView("loaded");
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        return;
      }
      if (error instanceof ApiClientError && error.kind === "abort") {
        return;
      }
      if (error instanceof ApiClientError && error.kind === "not_found") {
        setNotFound(true);
        setReport(null);
        setView("error");
        return;
      }
      setNotFound(false);
      setView("error");
    }
  }, [id]);

  useEffect(() => {
    setView("loading");
    setNotFound(false);
    setReport(null);
    void load();

    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  const retryLoad = useCallback((): void => {
    setView("loading");
    setNotFound(false);
    void load();
  }, [load]);

  const downloadReport = useCallback((): void => {
    if (report === null || id === undefined) {
      return;
    }

    setDownloadInFlight(true);
    try {
      downloadJson(complianceReportFilename(id), report);
      enqueue("Compliance report downloaded.");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Export failed.";
      enqueue(message);
    } finally {
      setDownloadInFlight(false);
    }
  }, [enqueue, id, report]);

  return {
    report,
    view,
    notFound,
    showLoadingSpinner,
    retryLoad,
    downloadReport,
    downloadInFlight,
  };
}
