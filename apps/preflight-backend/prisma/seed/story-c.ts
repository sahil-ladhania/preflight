/**
 * story-c — seed asset C (blocked, SEBI-01 fail).
 */
import type { AssetSeedDef, FindingSeed, StoryHelpers } from "./story-h.js";

export const ASSET_C_DEF: AssetSeedDef = {
  letter: "c",
  id: "11111111-1111-4111-8111-111111111103",
  channel: "whatsapp",
  copy: {
    headline: "Bluepeak Flexi Cap — WhatsApp status",
    body: "Grow your wealth with Bluepeak Flexi Cap. No disclaimer included in this short update.",
    disclaimer: "",
    cta: "Tap to invest",
  },
  generatedAt: "2026-03-13T09:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
};

export function buildFindingsC(
  canonicalText: string,
  h: StoryHelpers,
): FindingSeed[] {
  return [
    h.detFail(
      "SEBI-01",
      "Standard risk disclaimer absent.",
      canonicalText,
      "2026-03-13T09:05:00.000Z",
    ),
    h.detPass("SEBI-02", ASSET_C_DEF.generatedAt),
  ];
}
