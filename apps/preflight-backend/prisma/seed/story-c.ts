/**
 * story-c — seed asset C (blocked, SEBI-01 fail).
 */
import { buildFullFindings, type JudgementStory } from "./story-findings.js";
import type { AssetSeedDef, FindingSeed, StoryHelpers } from "./story-h.js";

export const ASSET_C_DEF: AssetSeedDef = {
  letter: "c",
  id: "c3d5e607-7f03-4111-8111-0000000000c3",
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

const JDG_STORY: JudgementStory = {
  "SEBI-06": { kind: "pass" },
  "BRAND-02": { kind: "pass" },
  "BRAND-03": { kind: "pass" },
};

export function buildFindingsC(
  canonicalText: string,
  h: StoryHelpers,
): FindingSeed[] {
  return buildFullFindings(ASSET_C_DEF, canonicalText, h, JDG_STORY);
}
