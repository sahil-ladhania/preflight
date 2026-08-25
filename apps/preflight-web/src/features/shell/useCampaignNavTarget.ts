/**
 * useCampaignNavTarget — TopBar Campaign nav always starts a fresh campaign.
 * Why: resume latest only on Workbench handoff (useWorkbench).
 */

import { useCreateCampaign } from "@/features/campaign/useCreateCampaign";
import type { CampaignNavTarget } from "@/features/shell/types";

export function useCampaignNavTarget(): CampaignNavTarget {
  const { createInFlight, createCampaignAndGo } = useCreateCampaign();

  return {
    navigating: createInFlight,
    navigateToCampaign: createCampaignAndGo,
  };
}
