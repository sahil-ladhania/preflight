/**
 * useCampaignNavTarget — resolve Campaign nav href on mount.
 * Why: TopBar must not use fixture CAMPAIGN_ID (15 §4.8).
 */

import { useEffect, useState } from "react";

import { resolveCampaignNavService } from "@/features/shell/campaign-nav.service";
import type { CampaignNavTarget } from "@/features/shell/types";
import { useToastContext } from "@/features/shell/ToastHost";
import { ApiClientError } from "@/lib/api";

export function useCampaignNavTarget(): CampaignNavTarget {
  const { enqueue } = useToastContext();
  const [campaignHref, setCampaignHref] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();

    const resolve = async (): Promise<void> => {
      try {
        const id = await resolveCampaignNavService(controller.signal);
        if (controller.signal.aborted) {
          return;
        }
        setCampaignHref(`/campaign/${id}`);
        setDisabled(false);
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return;
        }
        if (error instanceof ApiClientError && error.kind === "abort") {
          return;
        }
        setDisabled(true);
        if (error instanceof ApiClientError) {
          enqueue(error.apiError ?? error.message);
          return;
        }
        if (error instanceof Error) {
          enqueue(error.message);
        }
      }
    };

    void resolve();

    return () => {
      controller.abort();
    };
  }, [enqueue]);

  return { campaignHref, disabled };
}
