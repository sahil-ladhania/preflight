/**
 * useCampaignAssets — campaign-scoped assets from GET /assets.
 * Why: Built pane filters list items by campaignId and polls the judgement
 * fan-out the same way the register does.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import type { AssetListItemDTO } from "@preflight/schemas";

import { getAssetsService } from "@/features/assets/assets.service";
import { usePendingPoll } from "@/features/assets/usePendingPoll";

export function useCampaignAssets(campaignId: string | undefined): {
  assets: AssetListItemDTO[];
  loading: boolean;
  reload: () => Promise<void>;
} {
  const [assets, setAssets] = useState<AssetListItemDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (): Promise<void> => {
    if (campaignId === undefined) {
      setAssets([]);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    try {
      const response = await getAssetsService(controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      setAssets(
        response.assets.filter((asset) => asset.campaignId === campaignId),
      );
    } catch {
      // Keep the rows already on screen; the next poll tick may recover.
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [campaignId]);

  useEffect(() => {
    setAssets([]);
    void load();

    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  usePendingPoll(
    load,
    assets.some((asset) => asset.pendingCount > 0),
  );

  return { assets, loading, reload: load };
}
