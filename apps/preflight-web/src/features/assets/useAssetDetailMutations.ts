/**
 * useAssetDetailMutations — finding and asset write actions.
 * Why: extracted from useAssetDetail to stay under file limit.
 */
// size: six mutation handlers co-located per 15 §4.2 policy.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";

import type { AssetDetailDTO, RerunStripDTO } from "@preflight/schemas";

import {
  decideFindingService,
  getAssetDetailService,
  rerunAssetService,
  retryFindingService,
  waiveFindingService,
} from "@/features/assets/assets.service";
import type { ReasonModalState } from "@/features/assets/types";
import { generateCampaignAssetsService } from "@/features/campaign/campaign.service";
import { useToastContext } from "@/features/shell/ToastHost";
import { ApiClientError } from "@/lib/api";

interface UseAssetDetailMutationsInput {
  assetId: string | undefined;
  assetDto: AssetDetailDTO | null;
  reasonModal: ReasonModalState;
  setAssetDto: Dispatch<SetStateAction<AssetDetailDTO | null>>;
  setRerunStrip: Dispatch<SetStateAction<RerunStripDTO | null>>;
  closeReasonModal: () => void;
}

export function useAssetDetailMutations({
  assetId,
  assetDto,
  reasonModal,
  setAssetDto,
  setRerunStrip,
  closeReasonModal,
}: UseAssetDetailMutationsInput): {
  confirmFinding: (findingId: string) => Promise<void>;
  submitReason: (reason: string) => Promise<void>;
  retryFinding: (findingId: string) => Promise<void>;
  rerun: () => Promise<void>;
  regenerate: () => Promise<void>;
  accept: () => void;
  regenerateInFlight: boolean;
  rerunInFlight: boolean;
} {
  const navigate = useNavigate();
  const { enqueue } = useToastContext();
  const [regenerateInFlight, setRegenerateInFlight] = useState<boolean>(false);
  const [rerunInFlight, setRerunInFlight] = useState<boolean>(false);
  const regenerateGuardRef = useRef<boolean>(false);
  const rerunGuardRef = useRef<boolean>(false);
  const mutationAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      mutationAbortRef.current?.abort();
    };
  }, []);

  const toastApiError = useCallback(
    (error: unknown): void => {
      if (error instanceof ApiClientError && error.kind === "abort") {
        return;
      }
      if (error instanceof ApiClientError) {
        enqueue(error.apiError ?? error.message);
        return;
      }
      if (error instanceof Error) {
        enqueue(error.message);
      }
    },
    [enqueue],
  );

  const beginMutation = (): AbortController => {
    mutationAbortRef.current?.abort();
    const controller = new AbortController();
    mutationAbortRef.current = controller;
    return controller;
  };

  const patchFinding = useCallback(
    (
      findingId: string,
      status: AssetDetailDTO["status"],
      finding: AssetDetailDTO["findings"][number],
    ): void => {
      setAssetDto((current) => {
        if (current === null) {
          return current;
        }
        return {
          ...current,
          status,
          findings: current.findings.map((row) =>
            row.id === findingId ? finding : row,
          ),
        };
      });
    },
    [setAssetDto],
  );

  const refetchDetail = useCallback(
    async (controller: AbortController): Promise<void> => {
      if (assetId === undefined) {
        return;
      }
      const detail = await getAssetDetailService(assetId, controller.signal);
      if (!controller.signal.aborted) {
        setAssetDto(detail);
      }
    },
    [assetId, setAssetDto],
  );

  const confirmFinding = useCallback(
    async (findingId: string): Promise<void> => {
      const controller = beginMutation();
      try {
        await decideFindingService(
          findingId,
          { verdict: "confirmed" },
          controller.signal,
        );
        if (controller.signal.aborted) {
          return;
        }
        await refetchDetail(controller);
      } catch (error: unknown) {
        toastApiError(error);
      }
    },
    [refetchDetail, toastApiError],
  );

  const submitReason = useCallback(
    async (reason: string): Promise<void> => {
      const { mode, findingId } = reasonModal;
      if (findingId === null || mode === "closed") {
        return;
      }

      const controller = beginMutation();

      try {
        if (mode === "override") {
          await decideFindingService(
            findingId,
            { verdict: "overridden", reason },
            controller.signal,
          );
          if (controller.signal.aborted) {
            return;
          }
          await refetchDetail(controller);
          closeReasonModal();
          return;
        }

        await waiveFindingService(
          findingId,
          { reason },
          controller.signal,
        );
        if (controller.signal.aborted) {
          return;
        }
        await refetchDetail(controller);

        closeReasonModal();
      } catch (error: unknown) {
        toastApiError(error);
      }
    },
    [
      closeReasonModal,
      reasonModal,
      refetchDetail,
      toastApiError,
    ],
  );

  const retryFinding = useCallback(
    async (findingId: string): Promise<void> => {
      const controller = beginMutation();
      try {
        const response = await retryFindingService(findingId, controller.signal);
        if (controller.signal.aborted) {
          return;
        }
        patchFinding(findingId, response.status, response.finding);
      } catch (error: unknown) {
        toastApiError(error);
      }
    },
    [patchFinding, toastApiError],
  );

  const rerun = useCallback(async (): Promise<void> => {
    if (assetId === undefined || rerunGuardRef.current) {
      return;
    }

    rerunGuardRef.current = true;
    setRerunInFlight(true);
    const controller = beginMutation();
    try {
      const strip = await rerunAssetService(assetId, controller.signal);
      if (!controller.signal.aborted) {
        setRerunStrip(strip);
      }
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      rerunGuardRef.current = false;
      setRerunInFlight(false);
    }
  }, [assetId, setRerunStrip, toastApiError]);

  const regenerate = useCallback(async (): Promise<void> => {
    if (assetDto === null || regenerateGuardRef.current) {
      return;
    }

    regenerateGuardRef.current = true;
    setRegenerateInFlight(true);
    const controller = beginMutation();
    try {
      const response = await generateCampaignAssetsService(
        assetDto.campaignId,
        { regeneratedFromId: assetDto.id },
        controller.signal,
      );
      if (controller.signal.aborted) {
        return;
      }
      const nextId = response.assets[0]?.id;
      if (nextId !== undefined) {
        navigate(`/assets/${nextId}`);
      }
    } catch (error: unknown) {
      toastApiError(error);
    } finally {
      regenerateGuardRef.current = false;
      setRegenerateInFlight(false);
    }
  }, [assetDto, navigate, toastApiError]);

  const accept = useCallback((): void => {
    enqueue("Would ship — demo has no publishing.");
  }, [enqueue]);

  return {
    confirmFinding,
    submitReason,
    retryFinding,
    rerun,
    regenerate,
    accept,
    regenerateInFlight,
    rerunInFlight,
  };
}
