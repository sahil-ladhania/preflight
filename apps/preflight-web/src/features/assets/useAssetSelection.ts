/**
 * useAssetSelection — local selection and modal state for AssetDetail.
 * Why: extracted from AssetDetail orchestrator for file size (size-and-dry.mdc).
 */

import { useEffect, useRef, useState } from "react";
import type { FindingDTO, RerunStripDTO } from "@preflight/schemas";

import { scrollFindingTarget } from "@/features/assets/lib";
import { firstOpenFindingId } from "@/features/assets/ledger-lib";
import type { ReasonModalState } from "@/features/assets/types";
import { useToastContext } from "@/features/shell/ToastHost";
import { RERUN_STRIPS } from "@/fixtures/assets-detail";

interface UseAssetSelectionProps {
  assetId: string;
  findings: FindingDTO[];
  openFindingIdProp?: string | null;
  reasonModalProp?: ReasonModalState;
  rerunStripProp?: RerunStripDTO | null;
  onSpanClick?: (findingId: string) => void;
  onRowClick?: (findingId: string) => void;
  onAccept?: () => void;
  onRerun?: () => void;
  onCloseReasonModal?: () => void;
  onSubmitReason?: (reason: string) => void;
}

export function useAssetSelection({
  assetId,
  findings,
  openFindingIdProp,
  reasonModalProp,
  rerunStripProp = null,
  onSpanClick,
  onRowClick,
  onAccept,
  onRerun,
  onCloseReasonModal,
  onSubmitReason,
}: UseAssetSelectionProps) {
  const { enqueue } = useToastContext();
  const [localOpenFindingId, setLocalOpenFindingId] = useState<string | null>(
    () =>
      openFindingIdProp !== undefined
        ? null
        : firstOpenFindingId(findings),
  );
  const [localReasonModal, setLocalReasonModal] = useState<ReasonModalState>({
    mode: "closed",
    findingId: null,
  });
  const [localRerunStrip, setLocalRerunStrip] = useState(rerunStripProp);
  const scrollTargetRef = useRef<"span" | "row" | null>(
    openFindingIdProp === undefined && firstOpenFindingId(findings) !== null
      ? "span"
      : null,
  );

  const openFindingId = openFindingIdProp ?? localOpenFindingId;
  const reasonModal = reasonModalProp ?? localReasonModal;
  const rerunStrip = onRerun !== undefined ? rerunStripProp : localRerunStrip;

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
    setLocalRerunStrip(RERUN_STRIPS[assetId] ?? null);
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

  const openOverrideModal = (findingId: string): void => {
    setLocalReasonModal({ mode: "override", findingId });
  };

  const openWaiveModal = (findingId: string): void => {
    setLocalReasonModal({ mode: "waive", findingId });
  };

  return {
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
  };
}
