/**
 * useAssetDetail — GET /assets/:id and mutations.
 * Why: span↔row selection state lives here.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import type { RerunStripDTO } from "@preflight/schemas";

import { getAssetDetailService } from "@/features/assets/assets.service";
import { scrollFindingTarget } from "@/features/assets/lib";
import { buildCopySegments } from "@/features/assets/span-highlight";
import type {
  AssetDetailFixture,
  AssetDetailView,
  ReasonModalState,
} from "@/features/assets/types";
import { useAssetDetailMutations } from "@/features/assets/useAssetDetailMutations";
import { usePendingPoll } from "@/features/assets/usePendingPoll";
import { useDelayedLoading } from "@/features/shell/useDelayedLoading";
import { ApiClientError } from "@/lib/api";

function toFixture(dto: Parameters<typeof buildCopySegments>[0]): AssetDetailFixture {
  return {
    ...dto,
    copySegments: buildCopySegments(dto),
  };
}

export function useAssetDetail(id: string | undefined): {
  asset: AssetDetailFixture | null;
  view: AssetDetailView;
  notFound: boolean;
  showLoadingSpinner: boolean;
  rerunStrip: RerunStripDTO | null;
  openFindingId: string | null;
  selectSpanFinding: (findingId: string) => void;
  selectRowFinding: (findingId: string) => void;
  reasonModal: ReasonModalState;
  openOverride: (findingId: string) => void;
  openWaive: (findingId: string) => void;
  closeReasonModal: () => void;
  submitReason: (reason: string) => Promise<void>;
  confirmFinding: (findingId: string) => Promise<void>;
  retryFinding: (findingId: string) => Promise<void>;
  rerun: () => Promise<void>;
  regenerate: () => Promise<void>;
  accept: () => void;
  regenerateInFlight: boolean;
  rerunInFlight: boolean;
  retryLoad: () => void;
} {
  const [asset, setAsset] = useState<AssetDetailFixture | null>(null);
  const [view, setView] = useState<AssetDetailView>("loading");
  const [notFound, setNotFound] = useState<boolean>(false);
  const [rerunStrip, setRerunStrip] = useState<RerunStripDTO | null>(null);
  const [openFindingId, setOpenFindingId] = useState<string | null>(null);
  const scrollTargetRef = useRef<"span" | "row" | null>(null);
  const [reasonModal, setReasonModal] = useState<ReasonModalState>({
    mode: "closed",
    findingId: null,
  });
  const abortRef = useRef<AbortController | null>(null);
  const showLoadingSpinner = useDelayedLoading(view === "loading");

  const load = useCallback(async (): Promise<void> => {
    if (id === undefined) {
      setNotFound(true);
      setView("error");
      setAsset(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const detail = await getAssetDetailService(id, controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      setAsset(toFixture(detail));
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
        setAsset(null);
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
    setRerunStrip(null);
    setOpenFindingId(null);
    setReasonModal({ mode: "closed", findingId: null });
    void load();

    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  const pollActive =
    view === "loaded" &&
    asset !== null &&
    asset.findings.some((finding) => finding.evaluationStatus === "pending");

  usePendingPoll(() => load(), pollActive);

  useEffect(() => {
    if (openFindingId === null || scrollTargetRef.current === null) {
      return;
    }
    const target = scrollTargetRef.current;
    scrollTargetRef.current = null;
    scrollFindingTarget(openFindingId, target);
  }, [openFindingId]);

  const selectSpanFinding = useCallback((findingId: string): void => {
    scrollTargetRef.current = "row";
    setOpenFindingId(findingId);
  }, []);

  const selectRowFinding = useCallback((findingId: string): void => {
    scrollTargetRef.current = "span";
    setOpenFindingId(findingId);
  }, []);

  const openOverride = useCallback((findingId: string): void => {
    setReasonModal({ mode: "override", findingId });
  }, []);

  const openWaive = useCallback((findingId: string): void => {
    setReasonModal({ mode: "waive", findingId });
  }, []);

  const closeReasonModal = useCallback((): void => {
    setReasonModal({ mode: "closed", findingId: null });
  }, []);

  const {
    confirmFinding,
    submitReason,
    retryFinding,
    rerun,
    regenerate,
    accept,
    regenerateInFlight,
    rerunInFlight,
  } = useAssetDetailMutations({
    assetId: id,
    asset,
    reasonModal,
    setAsset,
    setRerunStrip,
    closeReasonModal,
  });

  const retryLoad = useCallback((): void => {
    setView("loading");
    setNotFound(false);
    void load();
  }, [load]);

  return {
    asset,
    view,
    notFound,
    showLoadingSpinner,
    rerunStrip,
    openFindingId,
    selectSpanFinding,
    selectRowFinding,
    reasonModal,
    openOverride,
    openWaive,
    closeReasonModal,
    submitReason,
    confirmFinding,
    retryFinding,
    rerun,
    regenerate,
    accept,
    regenerateInFlight,
    rerunInFlight,
    retryLoad,
  };
}
