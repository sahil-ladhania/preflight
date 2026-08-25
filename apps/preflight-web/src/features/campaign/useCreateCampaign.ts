/**
 * useCreateCampaign — POST /campaigns and navigate to blank brief.
 * Why: shared by Assets list, Campaign page, and top nav.
 */

import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createNewCampaignNavService } from "@/features/shell/campaign-nav.service";
import { useToastContext } from "@/features/shell/ToastHost";
import { ApiClientError } from "@/lib/api";

export function useCreateCampaign(): {
  createInFlight: boolean;
  createCampaignAndGo: () => Promise<void>;
} {
  const navigate = useNavigate();
  const { enqueue } = useToastContext();
  const [createInFlight, setCreateInFlight] = useState<boolean>(false);
  const guardRef = useRef<boolean>(false);

  const createCampaignAndGo = useCallback(async (): Promise<void> => {
    if (createInFlight || guardRef.current) {
      return;
    }

    guardRef.current = true;
    setCreateInFlight(true);
    const controller = new AbortController();

    try {
      const id = await createNewCampaignNavService(controller.signal);
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
      setCreateInFlight(false);
    }
  }, [createInFlight, enqueue, navigate]);

  return { createInFlight, createCampaignAndGo };
}
