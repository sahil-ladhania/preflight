/**
 * asset-g — BRAND-03 judgement fail, no verdict.
 * Why: seed story G for detail fixture map.
 */

import type { AssetDetailFixture } from "@/features/assets/types";
import { ASSET_ID_G } from "@/fixtures/assets-list";

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

const BRAND03_ID = findingId("g", "BRAND-03");

export const ASSET_G: AssetDetailFixture = {
  id: ASSET_ID_G,
  campaignId: CAMPAIGN_ID,
  channel: "whatsapp",
  constraintSetId: CONSTRAINT_SET_ID,
  headline: "Bluepeak Flexi Cap — WhatsApp broadcast",
  body: "Bluepeak Flexi Cap is the only fund you will ever need for market-beating results.",
  disclaimer: "Mutual fund investments are subject to market risks.",
  cta: "Open account",
  canonicalText: "",
  fieldOffsets: FIELD_OFFSETS,
  runHash: RUN_HASH,
  rulesetHash: RULESET_HASH,
  ...ASSET_KIT_FIELDS,
  generatedAt: "2026-03-14T16:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
  status: "needs_human",
  findings: [
    passFinding("g", "SEBI-01", "deterministic"),
    passFinding("g", "SEBI-02", "deterministic"),
    {
      id: BRAND03_ID,
      ruleId: "BRAND-03",
      kind: "judgement",
      frozenWording: FROZEN_WORDING["BRAND-03"],
      evaluationStatus: "complete",
      machineVerdict: "fail",
      machineReason: "Copy overstates fund differentiation.",
      spans: [{ start: 22, end: 46, text: "only fund you will ever need" }],
      machineAt: "2026-03-14T16:05:00.000Z",
      humanVerdict: null,
      humanReason: null,
      humanActor: null,
      humanAt: null,
    },
  ],
  exceptions: [],
  lineage: null,
  copySegments: {
    headline: [{ text: "Bluepeak Flexi Cap — WhatsApp broadcast", findingId: null }],
    body: [
      { text: "Bluepeak Flexi Cap is the ", findingId: null },
      { text: "only fund you will ever need", findingId: BRAND03_ID },
      { text: " for market-beating results.", findingId: null },
    ],
    disclaimer: [
      {
        text: "Mutual fund investments are subject to market risks.",
        findingId: null,
      },
    ],
    cta: [{ text: "Open account", findingId: null }],
  },
};
