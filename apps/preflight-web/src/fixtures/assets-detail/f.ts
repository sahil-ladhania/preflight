/**
 * asset-f — SEBI-06 unavailable (span locate fail).
 * Why: seed story F for detail fixture map.
 */

import type { AssetDetailFixture } from "@/features/assets/types";
import { ASSET_ID_F } from "@/fixtures/assets-list";

import {
  CAMPAIGN_ID,
  CONSTRAINT_SET_ID,
  FIELD_OFFSETS,
  FROZEN_WORDING,
  RUN_HASH,
  RULESET_HASH,
  ASSET_KIT_FIELDS,
  findingId,
  passFinding,
} from "./shared";

const SEBI06_ID = findingId("f", "SEBI-06");

export const ASSET_F: AssetDetailFixture = {
  id: ASSET_ID_F,
  campaignId: CAMPAIGN_ID,
  channel: "landing",
  constraintSetId: CONSTRAINT_SET_ID,
  headline: "Bluepeak Flexi Cap — landing page hero",
  body: "Build long-term wealth with a research-driven flexi cap approach.",
  disclaimer: "Mutual fund investments are subject to market risks.",
  cta: "Start investing",
  canonicalText: "",
  fieldOffsets: FIELD_OFFSETS,
  runHash: RUN_HASH,
  rulesetHash: RULESET_HASH,
  ...ASSET_KIT_FIELDS,
  generatedAt: "2026-03-14T14:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
  status: "needs_human",
  findings: [
    passFinding("f", "SEBI-01", "deterministic"),
    passFinding("f", "SEBI-02", "deterministic"),
    {
      id: SEBI06_ID,
      ruleId: "SEBI-06",
      kind: "judgement",
      frozenWording: FROZEN_WORDING["SEBI-06"],
      evaluationStatus: "unavailable",
      machineVerdict: null,
      machineReason: null,
      spans: [],
      machineAt: null,
      humanVerdict: null,
      humanReason: null,
      humanActor: null,
      humanAt: null,
      judgeRun: null,
      decisions: [],
    },
  ],
  exceptions: [],
  lineage: null,
  copySegments: {
    headline: [
      { text: "Bluepeak Flexi Cap — landing page hero", findingId: null },
    ],
    body: [
      {
        text: "Build long-term wealth with a research-driven flexi cap approach.",
        findingId: null,
      },
    ],
    disclaimer: [
      {
        text: "Mutual fund investments are subject to market risks.",
        findingId: null,
      },
    ],
    cta: [{ text: "Start investing", findingId: null }],
  },
};
