/**
 * AssetDetail — Screen 1 orchestrator.
 * Why: region siblings extracted; orchestrator stays ≤250 lines.
 */
// size: optional wired handlers for design-proof plus AssetDetailRoute shell.

import { useState, type ReactElement } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { AssetPane } from "@/features/assets/AssetPane";
import { ExceptionsSummary } from "@/features/assets/ExceptionsSummary";
import { LedgerPane } from "@/features/assets/LedgerPane";
import { LineageBanner } from "@/features/assets/LineageBanner";
import { ReasonModal } from "@/features/assets/ReasonModal";
import { RerunStrip } from "@/features/assets/RerunStrip";
import type { AssetDetailProps, ReasonModalState } from "@/features/assets/types";
import { useAssetDetail } from "@/features/assets/useAssetDetail";
import { useToastContext } from "@/features/shell/ToastHost";
import { RERUN_STRIPS } from "@/fixtures/assets-detail";

function LoadingState({
  showSpinner,
}: {
  showSpinner: boolean;
}): ReactElement {
  if (!showSpinner) {
    return <div className="min-h-[calc(100vh-3rem)] bg-canvas-subtle" />;
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <div
        className="size-4 animate-spin rounded-full border-2 border-fg border-t-transparent"
        aria-label="Loading"
      />
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry?: () => void }): ReactElement {
  const handleRetry = (): void => {
    onRetry?.();
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center gap-4">
      <p className="text-caption text-fg-muted">Could not load asset.</p>
      <Button type="button" variant="outline" onClick={handleRetry}>
        Retry
      </Button>
    </div>
  );
}

function NotFoundState(): ReactElement {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <p className="text-caption text-fg-muted">Asset not found</p>
    </div>
  );
}

export function AssetDetail({
  asset,
  view = "loaded",
  rerunStrip: rerunStripProp = null,
  showLoadingSpinner = true,
  openFindingId: openFindingIdProp,
  reasonModal: reasonModalProp,
  onSpanClick,
  onConfirm,
  onOverride,
  onWaive,
  onRetry,
  onRerun,
  onRegenerate,
  onAccept,
  onCloseReasonModal,
  onSubmitReason,
  onRetryLoad,
}: AssetDetailProps): ReactElement {
  const { enqueue } = useToastContext();
  const [localOpenFindingId, setLocalOpenFindingId] = useState<string | null>(
    null,
  );
  const [localReasonModal, setLocalReasonModal] = useState<ReasonModalState>({
    mode: "closed",
    findingId: null,
  });
  const [localRerunStrip, setLocalRerunStrip] = useState(rerunStripProp);

  const openFindingId = openFindingIdProp ?? localOpenFindingId;
  const reasonModal = reasonModalProp ?? localReasonModal;
  const rerunStrip = onRerun !== undefined ? rerunStripProp : localRerunStrip;

  const selectFinding = (findingId: string): void => {
    if (onSpanClick !== undefined) {
      onSpanClick(findingId);
      return;
    }
    setLocalOpenFindingId(findingId);
  };

  if (view === "loading") {
    return <LoadingState showSpinner={showLoadingSpinner} />;
  }

  if (view === "error") {
    return <ErrorState onRetry={onRetryLoad} />;
  }

  const handleAccept = (): void => {
    if (onAccept !== undefined) {
      onAccept();
      return;
    }
    enqueue("Would ship — demo has no publishing.");
  };

  const handleRerun = (): void => {
    if (onRerun !== undefined) {
      onRerun();
      return;
    }
    setLocalRerunStrip(RERUN_STRIPS[asset.id] ?? null);
  };

  const closeModal = (): void => {
    if (onCloseReasonModal !== undefined) {
      onCloseReasonModal();
      return;
    }
    setLocalReasonModal({ mode: "closed", findingId: null });
  };

  const submitModal = (reason: string): void => {
    if (onSubmitReason !== undefined) {
      void onSubmitReason(reason);
      return;
    }
    closeModal();
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col bg-canvas-subtle">
      {asset.lineage !== null ? (
        <LineageBanner lineage={asset.lineage} />
      ) : null}
      {asset.exceptions.length > 0 ? (
        <ExceptionsSummary exceptions={asset.exceptions} />
      ) : null}
      <div className="flex min-h-0 flex-1 gap-0 p-0">
        <div className="min-h-0 w-[58%] shrink-0 p-2">
          <AssetPane
            asset={asset}
            openFindingId={openFindingId}
            onSpanClick={selectFinding}
            onAccept={handleAccept}
            onRegenerate={() => {
              if (onRegenerate !== undefined) {
                void onRegenerate();
              }
            }}
          />
        </div>
        <div className="min-h-0 w-[42%] shrink-0 p-2 pl-0">
          <LedgerPane
            findings={asset.findings}
            openFindingId={openFindingId}
            onRowClick={selectFinding}
            onConfirm={(findingId) => {
              if (onConfirm !== undefined) {
                void onConfirm(findingId);
              }
            }}
            onOverride={(findingId) => {
              if (onOverride !== undefined) {
                onOverride(findingId);
                return;
              }
              setLocalReasonModal({ mode: "override", findingId });
            }}
            onWaive={(findingId) => {
              if (onWaive !== undefined) {
                onWaive(findingId);
                return;
              }
              setLocalReasonModal({ mode: "waive", findingId });
            }}
            onRetry={(findingId) => {
              if (onRetry !== undefined) {
                void onRetry(findingId);
              }
            }}
          />
        </div>
      </div>
      <RerunStrip strip={rerunStrip} onRerun={handleRerun} />
      <ReasonModal
        mode={reasonModal.mode}
        onClose={closeModal}
        onSubmit={submitModal}
      />
    </div>
  );
}

export function AssetDetailRoute(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const {
    asset,
    view,
    notFound,
    showLoadingSpinner,
    rerunStrip,
    openFindingId,
    setOpenFindingId,
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
    retryLoad,
  } = useAssetDetail(id);

  if (notFound) {
    return <NotFoundState />;
  }

  if (view === "loading") {
    return <LoadingState showSpinner={showLoadingSpinner} />;
  }

  if (view === "error" || asset === null) {
    return <ErrorState onRetry={retryLoad} />;
  }

  return (
    <AssetDetail
      asset={asset}
      view="loaded"
      rerunStrip={rerunStrip}
      openFindingId={openFindingId}
      reasonModal={reasonModal}
      onSpanClick={(findingId) => {
        setOpenFindingId(findingId);
      }}
      onConfirm={confirmFinding}
      onOverride={openOverride}
      onWaive={openWaive}
      onRetry={retryFinding}
      onRerun={() => {
        void rerun();
      }}
      onRegenerate={regenerate}
      onAccept={accept}
      onCloseReasonModal={closeReasonModal}
      onSubmitReason={submitReason}
      onRetryLoad={retryLoad}
    />
  );
}
