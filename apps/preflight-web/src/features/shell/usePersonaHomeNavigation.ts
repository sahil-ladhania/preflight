/**
 * usePersonaHomeNavigation — wordmark and 404 home follow persona landing.
 * Why: Meera resolves latest campaign; Arjun opens the asset register.
 */

import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { resolveWorkbenchCampaignHandoff } from "@/features/shell/campaign-nav.service";
import { landingKind } from "@/features/shell/persona";
import { usePersona } from "@/features/shell/PersonaProvider";
import { useToastContext } from "@/features/shell/ToastHost";
import type { PersonaHomeNavigation } from "@/features/shell/types";
import { ApiClientError } from "@/lib/api";

export function usePersonaHomeNavigation(): PersonaHomeNavigation {
  const navigate = useNavigate();
  const { actor } = usePersona();
  const { enqueue } = useToastContext();
  const [navigatingHome, setNavigatingHome] = useState<boolean>(false);
  const guardRef = useRef<boolean>(false);

  const goHome = useCallback(async (): Promise<void> => {
    if (actor === null || navigatingHome || guardRef.current) {
      return;
    }

    if (landingKind(actor.id) === "assets") {
      void navigate("/assets");
      return;
    }

    guardRef.current = true;
    setNavigatingHome(true);
    const controller = new AbortController();

    try {
      const campaignId = await resolveWorkbenchCampaignHandoff(controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      void navigate(`/campaign/${campaignId}`);
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
      setNavigatingHome(false);
    }
  }, [actor, enqueue, navigate, navigatingHome]);

  return { navigatingHome, goHome };
}
