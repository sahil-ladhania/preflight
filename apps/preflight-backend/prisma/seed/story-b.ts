/**
 * story-b — seed asset B (regenerated from A, open SEBI-06).
 */
import type { AssetSeedDef, FindingSeed, StoryHelpers } from "./story-h.js";

export const ASSET_B_DEF: AssetSeedDef = {
  letter: "b",
  id: "11111111-1111-4111-8111-111111111102",
  channel: "linkedin",
  copy: {
    headline: "Bluepeak Flexi Cap — LinkedIn post (regenerated)",
    body: "Strong track record with guaranteed returns continues to attract investors to Bluepeak Flexi Cap.",
    disclaimer: "Read all scheme related documents carefully.",
    cta: "Learn more",
  },
  generatedAt: "2026-03-15T12:30:00.000Z",
  regeneratedFromId: "11111111-1111-4111-8111-111111111101",
  generationIndex: 2,
};

export function buildFindingsB(
  canonicalText: string,
  h: StoryHelpers,
): FindingSeed[] {
  return [
    h.detPass("SEBI-01", ASSET_B_DEF.generatedAt),
    h.detPass("SEBI-02", ASSET_B_DEF.generatedAt),
    h.jdgFailOpen(
      "SEBI-06",
      "Regenerated copy still implies guaranteed returns.",
      "guaranteed returns",
      canonicalText,
      "2026-03-15T12:35:00.000Z",
    ),
  ];
}
