/**
 * AssetDetailRoute — wired Screen 1 route.
 * Why: extracted from AssetDetail orchestrator for file size.
 */

import type { ReactElement } from "react";
import { useParams } from "react-router-dom";

import { AssetDetail } from "@/features/assets/AssetDetail";
import {
  ErrorState,
  LoadingState,
  NotFoundState,
} from "@/features/assets/AssetDetailStates";
import { ComplianceDeskModal } from "@/features/assets/ComplianceDeskModal";
import { useAssetDetail } from "@/features/assets/useAssetDetail";

export function AssetDetailRoute(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const {
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
    complianceDeskOpen,
    closeComplianceDesk,
    confirmComplianceDesk,
    regenerateInFlight,
    rerunInFlight,
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
    <>
      <AssetDetail
        asset={asset}
        view="loaded"
        rerunStrip={rerunStrip}
        openFindingId={openFindingId}
        reasonModal={reasonModal}
        onSpanClick={selectSpanFinding}
        onRowClick={selectRowFinding}
        onConfirm={confirmFinding}
        onOverride={openOverride}
        onWaive={openWaive}
        onRetry={retryFinding}
        onRerun={() => {
          void rerun();
        }}
        onRegenerate={regenerate}
        onAccept={accept}
        regenerateInFlight={regenerateInFlight}
        rerunInFlight={rerunInFlight}
        onCloseReasonModal={closeReasonModal}
        onSubmitReason={submitReason}
        onRetryLoad={retryLoad}
      />
      <ComplianceDeskModal
        open={complianceDeskOpen}
        clientName={asset.brandKit.clientName}
        onClose={closeComplianceDesk}
        onConfirm={confirmComplianceDesk}
      />
    </>
  );
}
