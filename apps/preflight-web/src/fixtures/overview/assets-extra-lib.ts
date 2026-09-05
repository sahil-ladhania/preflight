/**
 * assets-extra-lib — shared campaign ids for Overview asset fixtures.
 * Why: action and clear fixture files share one campaign map.
 */

import type { AssetListItemDTO } from "@preflight/schemas";

import { OVERVIEW_CAMPAIGN_BLUEPEAK } from "@/fixtures/overview/campaigns";

export const NIPPON = "11111111-1111-4111-8111-111111111101";
export const SBI = "11111111-1111-4111-8111-111111111102";
export const ICICI = "11111111-1111-4111-8111-111111111103";
export const AXIS = "11111111-1111-4111-8111-111111111104";
export const KOTAK = "11111111-1111-4111-8111-111111111105";
export { OVERVIEW_CAMPAIGN_BLUEPEAK };

export function overviewAssetRow(
  partial: AssetListItemDTO,
): AssetListItemDTO {
  return partial;
}
