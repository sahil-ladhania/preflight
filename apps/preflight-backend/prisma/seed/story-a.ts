/**
 * story-a — seed asset A (needs_regen, SEBI-06 confirmed).
 */
import type { AssetSeedDef, FindingSeed, StoryHelpers } from "./story-h.js";

export const ASSET_A_DEF: AssetSeedDef = {
  letter: "a",
  id: "11111111-1111-4111-8111-111111111101",
  channel: "display",
  copy: {
    headline: "Bluepeak Flexi Cap — display banner",
    body: "Invest with confidence. Our fund has delivered strong growth with guaranteed returns for investors.",
    disclaimer: "Mutual fund investments are subject to market risks.",
    cta: "Invest now",
  },
  generatedAt: "2026-03-15T11:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
};

export function buildFindingsA(
  canonicalText: string,
  h: StoryHelpers,
): FindingSeed[] {
  return [
    h.detPass("SEBI-01", ASSET_A_DEF.generatedAt),
    h.detPass("SEBI-02", ASSET_A_DEF.generatedAt),
    h.jdgFailConfirmed(
      "SEBI-06",
      "Copy implies guaranteed returns.",
      "guaranteed returns",
      canonicalText,
      "2026-03-15T11:05:00.000Z",
      "Confirmed misleading performance claim.",
      "2026-03-15T11:10:00.000Z",
    ),
  ];
}
