/**
 * lib — Overview counts and persona section order.
 * Why: persona reorder and state-line math stay out of components.
 */

import type { AssetListItemDTO } from "@preflight/schemas";

import {
  isNeedsYouStatus,
  sortRegisterAssets,
} from "@/features/assets/register-lib";
import type { PersonaId } from "@/features/shell/types";
import type {
  OverviewCampaignMeta,
  OverviewSectionId,
} from "@/features/overview/types";

export interface OverviewStateCounts {
  needHuman: number;
  withException: number;
  campaignsInProgress: number;
}

const ARJUN_ORDER: OverviewSectionId[] = [
  "needsYou",
  "exceptions",
  "proofSpeed",
  "rulePressure",
];

const MEERA_ORDER: OverviewSectionId[] = [
  "proofSpeed",
  "needsYou",
  "exceptions",
  "rulePressure",
];

export function overviewSectionOrder(
  personaId: PersonaId,
): OverviewSectionId[] {
  return personaId === "meera" ? MEERA_ORDER : ARJUN_ORDER;
}

export function overviewStateCounts(
  assets: AssetListItemDTO[],
  campaigns: OverviewCampaignMeta[],
): OverviewStateCounts {
  let needHuman = 0;
  let withException = 0;

  for (const asset of assets) {
    if (isNeedsYouStatus(asset.status)) {
      needHuman++;
    }
    if (asset.status === "cleared_with_exception") {
      withException++;
    }
  }

  const campaignsInProgress = campaigns.filter((c) => c.inProgress).length;

  return { needHuman, withException, campaignsInProgress };
}

export function topNeedsYouAssets(
  assets: AssetListItemDTO[],
  limit = 5,
): AssetListItemDTO[] {
  return sortRegisterAssets(assets)
    .filter((asset) => isNeedsYouStatus(asset.status))
    .slice(0, limit);
}
