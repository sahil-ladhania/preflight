/**
 * useCampaignAssets — campaign-scoped assets from GET /assets.
 * Why: Built pane filters list items by campaignId client-side.
 */

import { useCallback, useEffect, useState } from "react";

import type { AssetListItemDTO } from "@preflight/schemas";

import { getAssetsService } from "@/features/assets/assets.service";

export function useCampaignAssets(campaignId: string | undefined): {
  assets: AssetListItemDTO[];
  loading: boolean;
  reload: () => void;
} {
  const [assets, setAssets] = useState<AssetListItemDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [reloadToken, setReloadToken] = useState<number>(0);

  const reload = useCallback((): void => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    if (campaignId === undefined) {
      setAssets([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    void (async (): Promise<void> => {
      try {
        const response = await getAssetsService(controller.signal);
        if (controller.signal.aborted) {
          return;
        }
        setAssets(
          response.assets.filter((asset) => asset.campaignId === campaignId),
        );
      } catch {
        if (!controller.signal.aborted) {
          setAssets([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [campaignId, reloadToken]);

  return { assets, loading, reload };
}
