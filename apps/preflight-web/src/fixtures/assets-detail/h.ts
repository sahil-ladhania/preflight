/**
 * asset-h — two pending judgement rules.
 * Why: seed story H for detail fixture map.
 */

import type { AssetDetailFixture } from "@/features/assets/types";
import { ASSET_ID_H } from "@/fixtures/assets-list";

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

const SEBI06_ID = findingId("h", "SEBI-06");
const BRAND03_ID = findingId("h", "BRAND-03");

export const ASSET_H: AssetDetailFixture = {
  id: ASSET_ID_H,
  campaignId: CAMPAIGN_ID,
  channel: "email",
  constraintSetId: CONSTRAINT_SET_ID,
  headline: "Bluepeak Flexi Cap — email fan-out in progress",
  body: "Discover Bluepeak Flexi Cap with market-leading flexibility and strong outcomes.",
  disclaimer: "Mutual fund investments are subject to market risks.",
  cta: "Invest today",
  canonicalText: "",
  fieldOffsets: FIELD_OFFSETS,
  runHash: RUN_HASH,
  rulesetHash: RULESET_HASH,
  ...ASSET_KIT_FIELDS,
  generatedAt: "2026-03-15T14:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
  status: "needs_human",
  findings: [
    passFinding("h", "SEBI-01", "deterministic"),
    passFinding("h", "SEBI-02", "deterministic"),
    {
      id: SEBI06_ID,
      ruleId: "SEBI-06",
      kind: "judgement",
      frozenWording: FROZEN_WORDING["SEBI-06"],
      evaluationStatus: "pending",
      machineVerdict: null,
      machineReason: null,
      spans: [],
      machineAt: null,
      humanVerdict: null,
      humanReason: null,
      humanActor: null,
      humanAt: null,
    },
    {
      id: BRAND03_ID,
      ruleId: "BRAND-03",
      kind: "judgement",
      frozenWording: FROZEN_WORDING["BRAND-03"],
      evaluationStatus: "pending",
      machineVerdict: null,
      machineReason: null,
      spans: [],
      machineAt: null,
      humanVerdict: null,
      humanReason: null,
      humanActor: null,
      humanAt: null,
    },
  ],
  exceptions: [],
  lineage: null,
  copySegments: {
    headline: [
      { text: "Bluepeak Flexi Cap — email fan-out in progress", findingId: null },
    ],
    body: [
      {
        text: "Discover Bluepeak Flexi Cap with market-leading flexibility and strong outcomes.",
        findingId: null,
      },
    ],
    disclaimer: [
      {
        text: "Mutual fund investments are subject to market risks.",
        findingId: null,
      },
    ],
    cta: [{ text: "Invest today", findingId: null }],
  },
};
