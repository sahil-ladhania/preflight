/**
 * asset-e — all pass, clear.
 * Why: seed story E for detail fixture map.
 */

import type { AssetDetailFixture } from "@/features/assets/types";
import { ASSET_ID_E } from "@/fixtures/assets-list";

import {
  CAMPAIGN_ID,
  CONSTRAINT_SET_ID,
  FIELD_OFFSETS,
  RUN_HASH,
  RULESET_HASH,
  ASSET_KIT_FIELDS,
  passFinding,
} from "./shared";

export const ASSET_E: AssetDetailFixture = {
  id: ASSET_ID_E,
  campaignId: CAMPAIGN_ID,
  channel: "email",
  constraintSetId: CONSTRAINT_SET_ID,
  headline: "Bluepeak Flexi Cap — email newsletter",
  body: "Bluepeak Flexi Cap Fund offers diversified flexi cap exposure across market caps.",
  disclaimer:
    "Mutual fund investments are subject to market risks. Read all scheme related documents carefully.",
  cta: "Subscribe",
  canonicalText: "",
  fieldOffsets: FIELD_OFFSETS,
  runHash: RUN_HASH,
  rulesetHash: RULESET_HASH,
  ...ASSET_KIT_FIELDS,
  generatedAt: "2026-03-14T10:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
  status: "clear",
  findings: [
    passFinding("e", "SEBI-01", "deterministic"),
    passFinding("e", "SEBI-02", "deterministic"),
    passFinding("e", "SEBI-03", "deterministic"),
    passFinding("e", "SEBI-06", "judgement"),
    passFinding("e", "BRAND-03", "judgement"),
  ],
  exceptions: [],
  lineage: null,
  copySegments: {
    headline: [{ text: "Bluepeak Flexi Cap — email newsletter", findingId: null }],
    body: [
      {
        text: "Bluepeak Flexi Cap Fund offers diversified flexi cap exposure across market caps.",
        findingId: null,
      },
    ],
    disclaimer: [
      {
        text: "Mutual fund investments are subject to market risks. Read all scheme related documents carefully.",
        findingId: null,
      },
    ],
    cta: [{ text: "Subscribe", findingId: null }],
  },
};
