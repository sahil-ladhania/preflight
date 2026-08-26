/**
 * asset-d — cleared_with_exception, SEBI-05 waived.
 * Why: seed story D for detail fixture map.
 */

import type { AssetDetailFixture } from "@/features/assets/types";
import { ASSET_ID_D } from "@/fixtures/assets-list";

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
  decisionRow,
} from "./shared";

const SEBI05_ID = findingId("d", "SEBI-05");

export const ASSET_D: AssetDetailFixture = {
  id: ASSET_ID_D,
  campaignId: CAMPAIGN_ID,
  channel: "display",
  constraintSetId: CONSTRAINT_SET_ID,
  headline: "Bluepeak Flexi Cap — display static",
  body: "Past performance of 18.4% over 3 years shown for illustration.",
  disclaimer: "Mutual fund investments are subject to market risks.",
  cta: "Apply now",
  canonicalText: "",
  fieldOffsets: FIELD_OFFSETS,
  runHash: RUN_HASH,
  rulesetHash: RULESET_HASH,
  ...ASSET_KIT_FIELDS,
  generatedAt: "2026-03-13T15:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
  status: "cleared_with_exception",
  findings: [
    passFinding("d", "SEBI-01", "deterministic"),
    passFinding("d", "SEBI-02", "deterministic"),
    {
      id: SEBI05_ID,
      ruleId: "SEBI-05",
      kind: "deterministic",
      frozenWording: FROZEN_WORDING["SEBI-05"],
      evaluationStatus: "complete",
      machineVerdict: "fail",
      machineReason: "Performance figure lacks required substantiation.",
      spans: [{ start: 0, end: 19, text: "Past performance" }],
      machineAt: "2026-03-13T15:05:00.000Z",
      humanVerdict: "waived",
      humanReason: "Approved exception for internal demo static.",
      humanActor: DEMO_OPERATOR,
      humanAt: "2026-03-13T15:20:00.000Z",
      judgeRun: null,
      decisions: [
        decisionRow({
          id: "dec-d-sebi05-1",
          action: "waive",
          previousVerdict: null,
          verdict: "waived",
          reason: "Internal demo — will revisit.",
          actor: DEMO_OPERATOR,
          at: "2026-03-13T15:05:00.000Z",
        }),
        decisionRow({
          id: "dec-d-sebi05-2",
          action: "waive",
          previousVerdict: "waived",
          verdict: "waived",
          reason: "Approved exception for internal demo static.",
          actor: DEMO_OPERATOR,
          at: "2026-03-13T15:20:00.000Z",
        }),
      ],
    },
    passFinding("d", "SEBI-06", "judgement"),
  ],
  exceptions: [
    {
      findingId: SEBI05_ID,
      ruleId: "SEBI-05",
      frozenWording: FROZEN_WORDING["SEBI-05"],
      humanReason: "Approved exception for internal demo static.",
      humanActor: DEMO_OPERATOR,
      humanAt: "2026-03-13T15:20:00.000Z",
    },
  ],
  lineage: null,
  copySegments: {
    headline: [{ text: "Bluepeak Flexi Cap — display static", findingId: null }],
    body: [
      { text: "Past performance", findingId: SEBI05_ID },
      { text: " of 18.4% over 3 years shown for illustration.", findingId: null },
    ],
    disclaimer: [
      {
        text: "Mutual fund investments are subject to market risks.",
        findingId: null,
      },
    ],
    cta: [{ text: "Apply now", findingId: null }],
  },
};
