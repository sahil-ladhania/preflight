/**
 * index — assets-detail fixture map and exports.
 * Why: route resolves GET /assets/:id body from static fixtures.
 */

import type { AssetDetailFixture } from "@/features/assets/types";
import {
  ASSET_ID_A,
  ASSET_ID_B,
  ASSET_ID_C,
  ASSET_ID_D,
  ASSET_ID_E,
  ASSET_ID_F,
  ASSET_ID_G,
  ASSET_ID_H,
} from "@/fixtures/assets-list";

import { ASSET_A } from "./a";
import { ASSET_B } from "./b";
import { ASSET_C } from "./c";
import { ASSET_D } from "./d";
import { ASSET_E } from "./e";
import { ASSET_F } from "./f";
import { ASSET_G } from "./g";
import { ASSET_H } from "./h";

export { RERUN_STRIPS, RERUN_STRIP_ENGINE_MISMATCH } from "./rerun-strips";

export const ASSETS_DETAIL: Record<string, AssetDetailFixture> = {
  [ASSET_ID_A]: ASSET_A,
  [ASSET_ID_B]: ASSET_B,
  [ASSET_ID_C]: ASSET_C,
  [ASSET_ID_D]: ASSET_D,
  [ASSET_ID_E]: ASSET_E,
  [ASSET_ID_F]: ASSET_F,
  [ASSET_ID_G]: ASSET_G,
  [ASSET_ID_H]: ASSET_H,
};
