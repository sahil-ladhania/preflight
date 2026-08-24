/**
 * asset-b — regenerated from A, SEBI-06 open review.
 * Why: seed story B for detail fixture map.
 */

import type { AssetDetailFixture } from "@/features/assets/types";
import { ASSET_ID_A, ASSET_ID_B } from "@/fixtures/assets-list";

import {
  CAMPAIGN_ID,
  CONSTRAINT_SET_ID,
  FIELD_OFFSETS,
  FROZEN_WORDING,
  RUN_HASH,
  RULESET_HASH,
  findingId,
  passFinding,
} from "./shared";

const SEBI06_ID = findingId("b", "SEBI-06");

export const ASSET_B: AssetDetailFixture = {
  id: ASSET_ID_B,
  campaignId: CAMPAIGN_ID,
  channel: "linkedin",
  constraintSetId: CONSTRAINT_SET_ID,
  headline: "Bluepeak Flexi Cap — LinkedIn post (regenerated)",
  body: "Strong track record with guaranteed returns continues to attract investors to Bluepeak Flexi Cap.",
  disclaimer: "Read all scheme related documents carefully.",
  cta: "Learn more",
  canonicalText: "",
  fieldOffsets: FIELD_OFFSETS,
  runHash: RUN_HASH,
  rulesetHash: RULESET_HASH,
  generatedAt: "2026-03-15T12:30:00.000Z",
  regeneratedFromId: ASSET_ID_A,
  generationIndex: 2,
  status: "needs_human",
  findings: [
    passFinding("b", "SEBI-01", "deterministic"),
    passFinding("b", "SEBI-02", "deterministic"),
    {
      id: SEBI06_ID,
      ruleId: "SEBI-06",
      kind: "judgement",
      frozenWording: FROZEN_WORDING["SEBI-06"],
      evaluationStatus: "complete",
      machineVerdict: "fail",
      machineReason: "Regenerated copy still implies guaranteed returns.",
      spans: [{ start: 22, end: 40, text: "guaranteed returns" }],
      machineAt: "2026-03-15T12:35:00.000Z",
      humanVerdict: null,
      humanReason: null,
      humanActor: null,
      humanAt: null,
    },
  ],
  exceptions: [],
  lineage: {
    parentId: ASSET_ID_A,
    parentGenerationIndex: 1,
    parentStatus: "needs_regen",
    ruleIds: ["SEBI-06"],
  },
  copySegments: {
    headline: [
      { text: "Bluepeak Flexi Cap — LinkedIn post (regenerated)", findingId: null },
    ],
    body: [
      { text: "Strong track record with ", findingId: null },
      { text: "guaranteed returns", findingId: SEBI06_ID },
      {
        text: " continues to attract investors to Bluepeak Flexi Cap.",
        findingId: null,
      },
    ],
    disclaimer: [
      {
        text: "Read all scheme related documents carefully.",
        findingId: null,
      },
    ],
    cta: [{ text: "Learn more", findingId: null }],
  },
};
