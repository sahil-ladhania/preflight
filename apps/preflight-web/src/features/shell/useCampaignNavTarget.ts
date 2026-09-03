/**
 * useCampaignNavTarget — TopBar Campaign nav resolves latest campaign.
 * Why: 09 Screen 3 — return visit without creating a new campaign.
 */

import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { resolveWorkbenchCampaignHandoff } from "@/features/shell/campaign-nav.service";
import type { CampaignNavTarget } from "@/features/shell/types";
import { useToastContext } from "@/features/shell/ToastHost";
import { ApiClientError } from "@/lib/api";

export function useCampaignNavTarget(): CampaignNavTarget {
  const navigate = useNavigate();
  const { enqueue } = useToastContext();
  const [navigating, setNavigating] = useState<boolean>(false);
  const guardRef = useRef<boolean>(false);

  const navigateToCampaign = useCallback(async (): Promise<void> => {
    if (navigating || guardRef.current) {
      return;
    }

    guardRef.current = true;
    setNavigating(true);
    const controller = new AbortController();

    try {
      const id = await resolveWorkbenchCampaignHandoff(controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      void navigate(`/campaign/${id}`);
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        return;
      }
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
    } finally {
      guardRef.current = false;
      setNavigating(false);
    }
  }, [enqueue, navigate, navigating]);

  return { navigating, navigateToCampaign };
}
