/**
 * asset-c — blocked, SEBI-01 deterministic fail.
 * Why: seed story C for detail fixture map.
 */

import type { AssetDetailFixture } from "@/features/assets/types";
import { ASSET_ID_C } from "@/fixtures/assets-list";

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

const SEBI01_ID = findingId("c", "SEBI-01");

export const ASSET_C: AssetDetailFixture = {
  id: ASSET_ID_C,
  campaignId: CAMPAIGN_ID,
  channel: "whatsapp",
  constraintSetId: CONSTRAINT_SET_ID,
  headline: "Bluepeak Flexi Cap — WhatsApp status",
  body: "Grow your wealth with Bluepeak Flexi Cap. No disclaimer included in this short update.",
  disclaimer: "",
  cta: "Tap to invest",
  canonicalText: "",
  fieldOffsets: FIELD_OFFSETS,
  runHash: RUN_HASH,
  rulesetHash: RULESET_HASH,
  ...ASSET_KIT_FIELDS,
  generatedAt: "2026-03-13T09:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
  status: "blocked",
  findings: [
    {
      id: SEBI01_ID,
      ruleId: "SEBI-01",
      kind: "deterministic",
      frozenWording: FROZEN_WORDING["SEBI-01"],
      evaluationStatus: "complete",
      machineVerdict: "fail",
      machineReason: "Standard risk disclaimer absent.",
      spans: [{ start: 0, end: 72, text: "Grow your wealth with Bluepeak Flexi Cap. No disclaimer included" }],
      machineAt: "2026-03-13T09:05:00.000Z",
      humanVerdict: null,
      humanReason: null,
      humanActor: null,
      humanAt: null,
    },
    passFinding("c", "SEBI-02", "deterministic"),
  ],
  exceptions: [],
  lineage: null,
  copySegments: {
    headline: [{ text: "Bluepeak Flexi Cap — WhatsApp status", findingId: null }],
    body: [
      {
        text: "Grow your wealth with Bluepeak Flexi Cap. No disclaimer included in this short update.",
        findingId: SEBI01_ID,
      },
    ],
    disclaimer: [{ text: "", findingId: null }],
    cta: [{ text: "Tap to invest", findingId: null }],
  },
};
