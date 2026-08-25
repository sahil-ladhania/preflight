/**
 * asset-a — needs_regen, SEBI-06 confirmed.
 * Why: seed story A for detail fixture map.
 */

import type { AssetDetailFixture } from "@/features/assets/types";
import { ASSET_ID_A } from "@/fixtures/assets-list";

import {
  CAMPAIGN_ID,
  CONSTRAINT_SET_ID,
  DEMO_OPERATOR,
  FIELD_OFFSETS,
  FROZEN_WORDING,
  RUN_HASH,
  RULESET_HASH,
  ASSET_KIT_FIELDS,
  findingId,
  passFinding,
} from "./shared";

const SEBI06_ID = findingId("a", "SEBI-06");

export const ASSET_A: AssetDetailFixture = {
  id: ASSET_ID_A,
  campaignId: CAMPAIGN_ID,
  channel: "display",
  constraintSetId: CONSTRAINT_SET_ID,
  headline: "Bluepeak Flexi Cap — display banner",
  body: "Invest with confidence. Our fund has delivered strong growth with guaranteed returns for investors.",
  disclaimer: "Mutual fund investments are subject to market risks.",
  cta: "Invest now",
  canonicalText: "",
  fieldOffsets: FIELD_OFFSETS,
  runHash: RUN_HASH,
  rulesetHash: RULESET_HASH,
  ...ASSET_KIT_FIELDS,
  generatedAt: "2026-03-15T11:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
  status: "needs_regen",
  findings: [
    passFinding("a", "SEBI-01", "deterministic"),
    passFinding("a", "SEBI-02", "deterministic"),
    {
      id: SEBI06_ID,
      ruleId: "SEBI-06",
      kind: "judgement",
      frozenWording: FROZEN_WORDING["SEBI-06"],
      evaluationStatus: "complete",
      machineVerdict: "fail",
      machineReason: "Copy implies guaranteed returns.",
      spans: [{ start: 80, end: 98, text: "guaranteed returns" }],
      machineAt: "2026-03-15T11:05:00.000Z",
      humanVerdict: "confirmed",
      humanReason: "Confirmed misleading performance claim.",
      humanActor: DEMO_OPERATOR,
      humanAt: "2026-03-15T11:10:00.000Z",
    },
  ],
  exceptions: [],
  lineage: null,
  copySegments: {
    headline: [{ text: "Bluepeak Flexi Cap — display banner", findingId: null }],
    body: [
      {
        text: "Invest with confidence. Our fund has delivered strong growth with ",
        findingId: null,
      },
      { text: "guaranteed returns", findingId: SEBI06_ID },
      { text: " for investors.", findingId: null },
    ],
    disclaimer: [
      {
        text: "Mutual fund investments are subject to market risks.",
        findingId: null,
      },
    ],
    cta: [{ text: "Invest now", findingId: null }],
  },
};
