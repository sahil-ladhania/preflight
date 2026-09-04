/**
 * AssetDetail — Screen 1 orchestrator in full-screen review mode.
 * Why: 3-column review mode outside app sidebar (08 §4.4, 09 Screen 1).
 */

import type { ReactElement } from "react";

import { AssetArtefactPane } from "@/features/assets/AssetArtefactPane";
import { AssetContextPane } from "@/features/assets/AssetContextPane";
import { AssetDecisionPane } from "@/features/assets/AssetDecisionPane";
import {
  ErrorState,
  LoadingState,
} from "@/features/assets/AssetDetailStates";
import { AssetReviewTopBar } from "@/features/assets/AssetReviewTopBar";
import { ReasonModal } from "@/features/assets/ReasonModal";
import {
  acceptDisabledCaption,
  acceptIsEnabled,
  findingById,
} from "@/features/assets/lib";
import type { AssetDetailProps } from "@/features/assets/types";
import { useAssetSelection } from "@/features/assets/useAssetSelection";

export { AssetDetailRoute } from "@/features/assets/AssetDetailRoute";

export function AssetDetail({
  asset,
  view = "loaded",
  rerunStrip: rerunStripProp = null,
  showLoadingSpinner = true,
  openFindingId: openFindingIdProp,
  reasonModal: reasonModalProp,
  onSpanClick,
  onRowClick,
  onConfirm,
  onOverride,
  onWaive,
  onRetry,
  onRerun,
  onRegenerate,
  onAccept,
  onExport,
  exportInFlight = false,
  regenerateInFlight = false,
  rerunInFlight = false,
  onCloseReasonModal,
  onSubmitReason,
  onRetryLoad,
  queueIndex = null,
  queueTotal = 0,
  hasPrevAsset = false,
  hasNextAsset = false,
  onPrevAsset,
  onNextAsset,
  campaignName,
}: AssetDetailProps): ReactElement {
  const {
    openFindingId,
    reasonModal,
    rerunStrip,
    selectSpanFinding,
    selectRowFinding,
    handleAccept,
    handleRerun,
    closeModal,
    submitModal,
    openOverrideModal,
    openWaiveModal,
  } = useAssetSelection({
    assetId: asset.id,
    findings: asset.findings,
    openFindingIdProp,
    reasonModalProp,
    rerunStripProp,
    onSpanClick,
    onRowClick,
    onAccept,
    onRerun,
    onCloseReasonModal,
    onSubmitReason,
  });

  if (view === "loading") {
    return <LoadingState showSpinner={showLoadingSpinner} />;
  }

  if (view === "error") {
    return <ErrorState onRetry={onRetryLoad} />;
  }

  const modalFinding =
    reasonModal.findingId !== null
      ? findingById(asset.findings, reasonModal.findingId)
      : undefined;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-ground">
      <AssetReviewTopBar
        headline={asset.headline}
        status={asset.status}
        queueIndex={queueIndex}
        queueTotal={queueTotal}
        hasPrevAsset={hasPrevAsset}
        hasNextAsset={hasNextAsset}
        onPrevAsset={onPrevAsset}
        onNextAsset={onNextAsset}
        acceptEnabled={acceptIsEnabled(asset.status)}
        disabledReason={acceptDisabledCaption(asset.status, asset.findings)}
        onAccept={handleAccept}
        onRegenerate={() => {
          if (onRegenerate !== undefined) {
            void onRegenerate();
          }
        }}
        regenerateInFlight={regenerateInFlight}
        onExport={() => {
          if (onExport !== undefined) {
            void onExport();
          }
        }}
        exportInFlight={exportInFlight}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden border-t border-fg">
        <AssetContextPane
          asset={asset}
          campaignName={campaignName}
          rerunStrip={rerunStrip}
          onRerun={handleRerun}
          rerunInFlight={rerunInFlight}
        />

        <AssetArtefactPane
          asset={asset}
          openFindingId={openFindingId}
          onSpanClick={selectSpanFinding}
        />

        <AssetDecisionPane
          findings={asset.findings}
          status={asset.status}
          openFindingId={openFindingId}
          onRowClick={selectRowFinding}
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
            openOverrideModal(findingId);
          }}
          onWaive={(findingId) => {
            if (onWaive !== undefined) {
              onWaive(findingId);
              return;
            }
            openWaiveModal(findingId);
          }}
          onRetry={(findingId) => {
            if (onRetry !== undefined) {
              void onRetry(findingId);
            }
          }}
          onAccept={handleAccept}
          onRegenerate={() => {
            if (onRegenerate !== undefined) {
              void onRegenerate();
            }
          }}
          regenerateInFlight={regenerateInFlight}
        />
      </div>

      <ReasonModal
        mode={reasonModal.mode}
        onClose={closeModal}
        onSubmit={submitModal}
        ruleId={modalFinding?.ruleId}
        frozenWording={modalFinding?.frozenWording}
        machineReason={modalFinding?.machineReason}
      />
    </div>
  );
}
