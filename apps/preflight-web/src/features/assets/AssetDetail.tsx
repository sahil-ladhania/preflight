/**
 * AssetDetail — Screen 1 orchestrator.
 * Why: region siblings extracted; route and states are separate modules.
 */
// size: orchestrator wires shell, split, modals — extract loses load order clarity

import { useState, useEffect, useRef, type ReactElement } from "react";

import { AssetDetailShell } from "@/features/assets/AssetDetailShell";
import { AssetPane } from "@/features/assets/AssetPane";
import {
  ErrorState,
  LoadingState,
} from "@/features/assets/AssetDetailStates";
import { ExceptionsSummary } from "@/features/assets/ExceptionsSummary";
import { GeneratorRunBanner } from "@/features/assets/GeneratorRunBanner";
import { LedgerPane } from "@/features/assets/LedgerPane";
import { LineageBanner } from "@/features/assets/LineageBanner";
import { ReasonModal } from "@/features/assets/ReasonModal";
import { findingById, scrollFindingTarget } from "@/features/assets/lib";
import type { AssetDetailProps, ReasonModalState } from "@/features/assets/types";
import { useToastContext } from "@/features/shell/ToastHost";
import { RERUN_STRIPS } from "@/fixtures/assets-detail";

export { AssetDetailRoute } from "@/features/assets/AssetDetailRoute";

export function AssetDetail({
  asset,
  view = "loaded",
  rerunStrip: rerunStripProp = null,
  generatorSkillsRead = null,
  buildNarration = null,
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
  const scrollTargetRef = useRef<"span" | "row" | null>(null);

  const openFindingId = openFindingIdProp ?? localOpenFindingId;
  const reasonModal = reasonModalProp ?? localReasonModal;
  const rerunStrip = onRerun !== undefined ? rerunStripProp : localRerunStrip;
  const modalFinding =
    reasonModal.findingId !== null
      ? findingById(asset.findings, reasonModal.findingId)
      : undefined;

  const selectSpanFinding = (findingId: string): void => {
    if (onSpanClick !== undefined) {
      onSpanClick(findingId);
      return;
    }
    scrollTargetRef.current = "row";
    setLocalOpenFindingId(findingId);
  };

  const selectRowFinding = (findingId: string): void => {
    if (onRowClick !== undefined) {
      onRowClick(findingId);
      return;
    }
    scrollTargetRef.current = "span";
    setLocalOpenFindingId(findingId);
  };

  useEffect(() => {
    if (openFindingIdProp !== undefined || openFindingId === null) {
      return;
    }
    if (scrollTargetRef.current === null) {
      return;
    }
    const target = scrollTargetRef.current;
    scrollTargetRef.current = null;
    scrollFindingTarget(openFindingId, target);
  }, [openFindingId, openFindingIdProp]);

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
    <AssetDetailShell
      headline={asset.headline}
      channel={asset.channel}
      assetId={asset.id}
      generatedAt={asset.generatedAt}
      status={asset.status}
    >
      <div className="flex flex-col gap-4 px-8 pb-4">
        {asset.lineage !== null ? (
          <LineageBanner lineage={asset.lineage} />
        ) : null}
        {generatorSkillsRead !== null ? (
          <GeneratorRunBanner
            skillsRead={generatorSkillsRead}
            narration={buildNarration}
          />
        ) : null}
        {asset.exceptions.length > 0 ? (
          <ExceptionsSummary exceptions={asset.exceptions} />
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 border-t border-hairline">
        <div className="min-h-0 w-pane-evidence shrink-0 bg-surface">
          <AssetPane
            asset={asset}
            openFindingId={openFindingId}
            onSpanClick={selectSpanFinding}
            onAccept={handleAccept}
            onRegenerate={() => {
              if (onRegenerate !== undefined) {
                void onRegenerate();
              }
            }}
            onExport={() => {
              if (onExport !== undefined) {
                void onExport();
              }
            }}
            exportInFlight={exportInFlight}
            regenerateInFlight={regenerateInFlight}
            rerunStrip={rerunStrip}
            onRerun={handleRerun}
            rerunInFlight={rerunInFlight}
          />
        </div>
        <div className="min-h-0 w-pane-ledger shrink-0 border-l border-hairline bg-ground">
          <LedgerPane
            findings={asset.findings}
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
      <ReasonModal
        mode={reasonModal.mode}
        onClose={closeModal}
        onSubmit={submitModal}
        ruleId={modalFinding?.ruleId}
        frozenWording={modalFinding?.frozenWording}
        machineReason={modalFinding?.machineReason}
      />
    </AssetDetailShell>
  );
}
