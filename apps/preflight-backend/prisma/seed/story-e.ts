/**
 * story-e — seed asset E (all pass, clear).
 */
import type { AssetSeedDef, FindingSeed, StoryHelpers } from "./story-h.js";

export const ASSET_E_DEF: AssetSeedDef = {
  letter: "e",
  id: "11111111-1111-4111-8111-111111111105",
  channel: "email",
  copy: {
    headline: "Bluepeak Flexi Cap — email newsletter",
    body: "Bluepeak Flexi Cap Fund offers diversified flexi cap exposure across market caps.",
    disclaimer:
      "Mutual fund investments are subject to market risks. Read all scheme related documents carefully.",
    cta: "Subscribe",
  },
  generatedAt: "2026-03-14T10:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
};

export function buildFindingsE(_canonicalText: string, h: StoryHelpers): FindingSeed[] {
  return [
    h.detPass("SEBI-01", ASSET_E_DEF.generatedAt),
    h.detPass("SEBI-02", ASSET_E_DEF.generatedAt),
    h.detPass("SEBI-03", ASSET_E_DEF.generatedAt),
    h.jdgPass("SEBI-06", ASSET_E_DEF.generatedAt),
    h.jdgPass("BRAND-03", ASSET_E_DEF.generatedAt),
  ];
}
