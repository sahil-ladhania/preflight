/**
 * story-d — seed asset D (cleared_with_exception, SEBI-05 waived).
 */
import { buildFullFindings, type JudgementStory } from "./story-findings.js";
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

const JDG_STORY: JudgementStory = {
  "SEBI-06": { kind: "pass" },
  "BRAND-02": { kind: "pass" },
  "BRAND-03": { kind: "pass" },
};

const DET_WAIVE = {
  ruleId: "SEBI-05",
  humanReason: "Approved exception for internal demo static.",
  humanAt: "2026-03-13T15:20:00.000Z",
};

export function buildFindingsD(
  canonicalText: string,
  h: StoryHelpers,
): FindingSeed[] {
  return buildFullFindings(ASSET_D_DEF, canonicalText, h, JDG_STORY, DET_WAIVE);
}
