/**
 * story-a — seed asset A (needs_regen, SEBI-06 confirmed).
 */
import { buildFullFindings, type JudgementStory } from "./story-findings.js";
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

const JDG_STORY: JudgementStory = {
  "SEBI-06": {
    kind: "confirmed",
    reason: "Copy implies guaranteed returns.",
    spanText: "guaranteed returns",
    machineAt: "2026-03-15T11:05:00.000Z",
    humanReason: "Confirmed misleading performance claim.",
    humanAt: "2026-03-15T11:10:00.000Z",
  },
  "BRAND-02": { kind: "pass" },
  "BRAND-03": { kind: "pass" },
};

export function buildFindingsA(
  canonicalText: string,
  h: StoryHelpers,
): FindingSeed[] {
  return buildFullFindings(ASSET_A_DEF, canonicalText, h, JDG_STORY);
}
