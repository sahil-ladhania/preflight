/**
 * useAssetsList — GET /assets and list poll state.
 * Why: poll when any row pendingCount > 0.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { AssetListItemDTO } from "@preflight/schemas";

import { getAssetsService } from "@/features/assets/assets.service";
import type { AssetsListView } from "@/features/assets/types";
import { usePendingPoll } from "@/features/assets/usePendingPoll";
import { createCampaignService } from "@/features/campaign/campaign.service";
import { useDelayedLoading } from "@/features/shell/useDelayedLoading";
import { useToastContext } from "@/features/shell/ToastHost";
import { ApiClientError } from "@/lib/api";

export function useAssetsList(): {
  assets: AssetListItemDTO[];
  view: AssetsListView;
  pollError: boolean;
  showLoadingSpinner: boolean;
  retry: () => void;
  createCampaignAndGo: () => Promise<void>;
} {
  const navigate = useNavigate();
  const { enqueue } = useToastContext();
  const [assets, setAssets] = useState<AssetListItemDTO[]>([]);
  const [view, setView] = useState<AssetsListView>("loading");
  const [pollError, setPollError] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);
  const showLoadingSpinner = useDelayedLoading(view === "loading");

  const load = useCallback(async (): Promise<void> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const data = await getAssetsService(controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      setAssets(data.assets);
      setPollError(false);
      setView("loaded");
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        return;
      }
      if (error instanceof ApiClientError && error.kind === "abort") {
        return;
      }
      setAssets((current) => {
        if (current.length > 0) {
          setPollError(true);
          return current;
        }
        setView("error");
        return current;
      });
    }
  }, []);

  useEffect(() => {
    setView("loading");
    setPollError(false);
    void load();

    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  const pollActive =
    view === "loaded" &&
    !pollError &&
    assets.some((asset) => asset.pendingCount > 0);

  usePendingPoll(() => load(), pollActive);

  const retry = useCallback((): void => {
    setPollError(false);
    if (assets.length === 0) {
      setView("loading");
    }
    void load();
  }, [assets.length, load]);

  const createCampaignAndGo = useCallback(async (): Promise<void> => {
    const controller = new AbortController();

    try {
      const campaign = await createCampaignService(
        { freeText: "" },
        controller.signal,
      );
      navigate(`/campaign/${campaign.id}`);
    } catch (error: unknown) {
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
    }
  }, [enqueue, navigate]);

  return {
    assets,
    view,
    pollError,
    showLoadingSpinner,
    retry,
    createCampaignAndGo,
  };
}
