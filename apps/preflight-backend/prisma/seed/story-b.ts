/**
 * story-b — seed asset B (regenerated from A, open SEBI-06).
 */
import { buildFullFindings, type JudgementStory } from "./story-findings.js";
import type { AssetSeedDef, FindingSeed, StoryHelpers } from "./story-h.js";

export const ASSET_B_DEF: AssetSeedDef = {
  letter: "b",
  id: "11111111-1111-4111-8111-111111111102",
  channel: "linkedin",
  copy: {
    headline: "Bluepeak Flexi Cap — LinkedIn post (regenerated)",
    body: "Strong track record with guaranteed returns continues to attract investors to Bluepeak Flexi Cap.",
    disclaimer:
      "Mutual Fund investments are subject to market risks, read all scheme related documents carefully.",
    cta: "Learn more",
  },
  generatedAt: "2026-03-15T12:30:00.000Z",
  regeneratedFromId: "11111111-1111-4111-8111-111111111101",
  generationIndex: 2,
};

const JDG_STORY: JudgementStory = {
  "SEBI-06": {
    kind: "open",
    reason: "Regenerated copy still implies guaranteed returns.",
    spanText: "guaranteed returns",
    machineAt: "2026-03-15T12:35:00.000Z",
  },
  "BRAND-02": { kind: "pass" },
  "BRAND-03": { kind: "pass" },
};

export function buildFindingsB(
  canonicalText: string,
  h: StoryHelpers,
): FindingSeed[] {
  return buildFullFindings(ASSET_B_DEF, canonicalText, h, JDG_STORY);
}
