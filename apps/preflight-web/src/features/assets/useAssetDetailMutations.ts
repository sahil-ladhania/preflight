/**
 * useAssetDetailMutations — finding and asset write actions.
 * Why: extracted from useAssetDetail to stay under file limit.
 */
// size: six mutation handlers co-located per 15 §4.2 policy.

import { useCallback, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

import type { RerunStripDTO } from "@preflight/schemas";

import {
  decideFindingService,
  getAssetDetailService,
  rerunAssetService,
  retryFindingService,
  waiveFindingService,
} from "@/features/assets/assets.service";
import { buildCopySegments } from "@/features/assets/span-highlight";
import type {
  AssetDetailFixture,
  ReasonModalState,
} from "@/features/assets/types";
import { generateCampaignAssetsService } from "@/features/campaign/campaign.service";
import { useToastContext } from "@/features/shell/ToastHost";
import { ApiClientError } from "@/lib/api";

interface UseAssetDetailMutationsInput {
  assetId: string | undefined;
  asset: AssetDetailFixture | null;
  reasonModal: ReasonModalState;
  setAsset: Dispatch<SetStateAction<AssetDetailFixture | null>>;
  setRerunStrip: Dispatch<SetStateAction<RerunStripDTO | null>>;
  closeReasonModal: () => void;
}

function toFixture(dto: Parameters<typeof buildCopySegments>[0]): AssetDetailFixture {
  return {
    ...dto,
    copySegments: buildCopySegments(dto),
  };
}

export function useAssetDetailMutations({
  assetId,
  asset,
  reasonModal,
  setAsset,
  setRerunStrip,
  closeReasonModal,
}: UseAssetDetailMutationsInput): {
  confirmFinding: (findingId: string) => Promise<void>;
  submitReason: (reason: string) => Promise<void>;
  retryFinding: (findingId: string) => Promise<void>;
  rerun: () => Promise<void>;
  regenerate: () => Promise<void>;
  accept: () => void;
} {
  const navigate = useNavigate();
  const { enqueue } = useToastContext();

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

  const patchFinding = useCallback(
    (
      findingId: string,
      status: AssetDetailFixture["status"],
      finding: AssetDetailFixture["findings"][number],
    ): void => {
      setAsset((current) => {
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
    [setAsset],
  );

  const confirmFinding = useCallback(
    async (findingId: string): Promise<void> => {
      const controller = new AbortController();
      try {
        const response = await decideFindingService(
          findingId,
          { verdict: "confirmed" },
          controller.signal,
        );
        patchFinding(findingId, response.status, response.finding);
      } catch (error: unknown) {
        toastApiError(error);
      }
    },
    [patchFinding, toastApiError],
  );

  const submitReason = useCallback(
    async (reason: string): Promise<void> => {
      const { mode, findingId } = reasonModal;
      if (findingId === null || mode === "closed") {
        return;
      }

      const controller = new AbortController();

      try {
        if (mode === "override") {
          const response = await decideFindingService(
            findingId,
            { verdict: "overridden", reason },
            controller.signal,
          );
          patchFinding(findingId, response.status, response.finding);
          closeReasonModal();
          return;
        }

        const response = await waiveFindingService(
          findingId,
          { reason },
          controller.signal,
        );
        patchFinding(findingId, response.status, response.finding);

        if (assetId !== undefined) {
          const detail = await getAssetDetailService(assetId, controller.signal);
          if (!controller.signal.aborted) {
            setAsset(toFixture(detail));
          }
        }

        closeReasonModal();
      } catch (error: unknown) {
        toastApiError(error);
      }
    },
    [
      assetId,
      closeReasonModal,
      patchFinding,
      reasonModal,
      setAsset,
      toastApiError,
    ],
  );

  const retryFinding = useCallback(
    async (findingId: string): Promise<void> => {
      const controller = new AbortController();
      try {
        const response = await retryFindingService(findingId, controller.signal);
        patchFinding(findingId, response.status, response.finding);
      } catch (error: unknown) {
        toastApiError(error);
      }
    },
    [patchFinding, toastApiError],
  );

  const rerun = useCallback(async (): Promise<void> => {
    if (assetId === undefined) {
      return;
    }

    const controller = new AbortController();
    try {
      const strip = await rerunAssetService(assetId, controller.signal);
      setRerunStrip(strip);
    } catch (error: unknown) {
      toastApiError(error);
    }
  }, [assetId, setRerunStrip, toastApiError]);

  const regenerate = useCallback(async (): Promise<void> => {
    if (asset === null) {
      return;
    }

    const controller = new AbortController();
    try {
      const response = await generateCampaignAssetsService(
        asset.campaignId,
        { regeneratedFromId: asset.id },
        controller.signal,
      );
      const nextId = response.assets[0]?.id;
      if (nextId !== undefined) {
        navigate(`/assets/${nextId}`);
      }
    } catch (error: unknown) {
      toastApiError(error);
    }
  }, [asset, navigate, toastApiError]);

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
  };
}
