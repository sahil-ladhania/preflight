/**
 * story-d — seed asset D (cleared_with_exception, SEBI-05 waived).
 */
import type { AssetSeedDef, FindingSeed, StoryHelpers } from "./story-h.js";

export const ASSET_D_DEF: AssetSeedDef = {
  letter: "d",
  id: "11111111-1111-4111-8111-111111111104",
  channel: "display",
  copy: {
    headline: "Bluepeak Flexi Cap — display static",
    body: "Past performance of 18.4% over 3 years shown for illustration.",
    disclaimer: "Mutual fund investments are subject to market risks.",
    cta: "Apply now",
  },
  generatedAt: "2026-03-13T15:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
};

export function buildFindingsD(
  canonicalText: string,
  h: StoryHelpers,
): FindingSeed[] {
  return [
    h.detPass("SEBI-01", ASSET_D_DEF.generatedAt),
    h.detPass("SEBI-02", ASSET_D_DEF.generatedAt),
    h.detFailWaived(
      "SEBI-05",
      "Performance figure lacks required substantiation.",
      canonicalText,
      "2026-03-13T15:05:00.000Z",
      "Approved exception for internal demo static.",
      "2026-03-13T15:20:00.000Z",
    ),
    h.jdgPass("SEBI-06", ASSET_D_DEF.generatedAt),
  ];
}
