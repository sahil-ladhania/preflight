/**
 * assets-extra — merged Overview assets beyond the Screen 2 seed list.
 * Why: single export for Overview fixture bundle.
 */

import type { AssetListItemDTO } from "@preflight/schemas";

import { OVERVIEW_ASSETS_EXTRA_ACTION } from "@/fixtures/overview/assets-extra-action";
import { OVERVIEW_ASSETS_EXTRA_CLEAR_A } from "@/fixtures/overview/assets-extra-clear-a";
import { OVERVIEW_ASSETS_EXTRA_CLEAR_B } from "@/fixtures/overview/assets-extra-clear-b";

export const OVERVIEW_ASSETS_EXTRA: AssetListItemDTO[] = [
  ...OVERVIEW_ASSETS_EXTRA_ACTION,
  ...OVERVIEW_ASSETS_EXTRA_CLEAR_A,
  ...OVERVIEW_ASSETS_EXTRA_CLEAR_B,
];
