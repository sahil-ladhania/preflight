/**
 * useCampaignHandoff — read Workbench navigation state once.
 * Why: apply structured brief proposal without re-running on refresh.
 */

import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { StructuredBriefInput } from "@preflight/schemas";

export interface CampaignHandoffPayload {
  proposal: StructuredBriefInput;
}

type LocationState = {
  handoff?: CampaignHandoffPayload;
};

export function useCampaignHandoff(): {
  pendingHandoff: CampaignHandoffPayload | null;
  clearHandoff: () => void;
} {
  const location = useLocation();
  const navigate = useNavigate();

  const pendingHandoff = useMemo((): CampaignHandoffPayload | null => {
    const state = location.state as LocationState | null;
    return state?.handoff ?? null;
  }, [location.state]);

  const clearHandoff = useCallback((): void => {
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, navigate]);

  return { pendingHandoff, clearHandoff };
}
