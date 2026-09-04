/**
 * AssetDetailRoute — wired Screen 1 route.
 * Why: extracted from AssetDetail orchestrator for file size.
 */

import type { ReactElement } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { AssetDetail } from "@/features/assets/AssetDetail";
import {
  ErrorState,
  LoadingState,
  NotFoundState,
} from "@/features/assets/AssetDetailStates";
import { ComplianceDeskModal } from "@/features/assets/ComplianceDeskModal";
import { isNeedsYouStatus } from "@/features/assets/register-lib";
import { useAssetDetail } from "@/features/assets/useAssetDetail";
import { useAssetsList } from "@/features/assets/useAssetsList";

/** Generate and regenerate hand the run's skill paths over in router state. */
type AssetDetailLocationState = {
  generatorSkillsRead?: string[];
  buildNarration?: string;
};

export function AssetDetailRoute(): ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as AssetDetailLocationState | null;
  const generatorSkillsRead = locationState?.generatorSkillsRead ?? null;
  const buildNarration = locationState?.buildNarration ?? null;
  const showVerdictBanner = buildNarration !== null;

  const { assets: listAssets } = useAssetsList();

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
    exportReport,
    exportInFlight,
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

  const queueAssets = listAssets.filter((item) => isNeedsYouStatus(item.status));
  const queueIndex0 = queueAssets.findIndex((item) => item.id === id);
  const queueIndex = queueIndex0 >= 0 ? queueIndex0 + 1 : null;
  const queueTotal = queueAssets.length;
  const hasPrevAsset = queueIndex0 > 0;
  const hasNextAsset =
    queueIndex0 >= 0
      ? queueIndex0 < queueAssets.length - 1
      : queueAssets.length > 0;

  const onPrevAsset = hasPrevAsset
    ? () => {
        const prev = queueAssets[queueIndex0 - 1];
        if (prev) {
          navigate(`/assets/${prev.id}`);
        }
      }
    : undefined;

  const onNextAsset = hasNextAsset
    ? () => {
        const next =
          queueIndex0 >= 0
            ? queueAssets[queueIndex0 + 1]
            : queueAssets[0];
        if (next) {
          navigate(`/assets/${next.id}`);
        }
      }
    : undefined;

  const campaignItem = listAssets.find(
    (item) => item.campaignId === asset.campaignId,
  );
  const campaignName = campaignItem?.campaignName;

  return (
    <>
      <AssetDetail
        asset={asset}
        view="loaded"
        rerunStrip={rerunStrip}
        generatorSkillsRead={generatorSkillsRead}
        buildNarration={buildNarration}
        showVerdictBanner={showVerdictBanner}
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
        onExport={exportReport}
        exportInFlight={exportInFlight}
        regenerateInFlight={regenerateInFlight}
        rerunInFlight={rerunInFlight}
        onCloseReasonModal={closeReasonModal}
        onSubmitReason={submitReason}
        onRetryLoad={retryLoad}
        queueIndex={queueIndex}
        queueTotal={queueTotal}
        hasPrevAsset={hasPrevAsset}
        hasNextAsset={hasNextAsset}
        onPrevAsset={onPrevAsset}
        onNextAsset={onNextAsset}
        campaignName={campaignName}
      />
      <ComplianceDeskModal
        open={complianceDeskOpen}
        clientName={asset.brandKit.clientName}
        status={asset.status}
        exceptions={asset.exceptions}
        onClose={closeComplianceDesk}
        onConfirm={confirmComplianceDesk}
      />
    </>
  );
}
