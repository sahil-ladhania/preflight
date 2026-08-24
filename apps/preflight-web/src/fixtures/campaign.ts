/**
 * campaign — Screen 3 fixtures.
 * Why: GET /campaigns/:id body without wiring.
 */

import type {
  CampaignDTO,
  CompileResponseDTO,
  LastCompileDTO,
  StructuredBriefInput,
} from "@preflight/schemas";

import { ASSET_ID_G } from "@/fixtures/assets-list";

export const CAMPAIGN_ID = "22222222-2222-4222-8222-222222222222";
export const CAMPAIGN_ID_FRESH = "33333333-3333-4333-8333-333333333301";
export const CONSTRAINT_SET_ID = "44444444-4444-4444-8444-444444444401";
export const RULESET_HASH = "b".repeat(64);

/** Demo generate navigates here — seeded asset G (needs_human). */
export const GENERATE_ASSET_ID = ASSET_ID_G;

export const SEED_BRIEF: StructuredBriefInput = {
  objective: "Drive awareness for Bluepeak Flexi Cap among digital investors.",
  schemeName: "Bluepeak Flexi Cap Fund",
  schemeCategory: "Flexi Cap",
  audience: "Retail investors aged 25–45",
  channels: ["display", "email", "linkedin"],
  market: "India",
  performanceFigures: [{ value: "18.2%", period: "3-year CAGR" }],
  claims: ["Market-leading flexibility", "Strong risk-adjusted outcomes"],
};

export const EXTRACT_PROPOSAL: Partial<StructuredBriefInput> = {
  objective: "Promote Bluepeak Flexi Cap to young professionals.",
  schemeName: "Bluepeak Flexi Cap Fund",
  schemeCategory: "Flexi Cap",
  audience: "Young professionals",
  channels: ["linkedin"],
  market: "India",
};

const COMPILE_RULES: LastCompileDTO["rules"] = [
  {
    ruleId: "SEBI-01",
    kind: "deterministic",
    wording: "Standard risk disclaimer must appear in the asset copy.",
    applicabilityReason: "Applies because channel includes email or display.",
  },
  {
    ruleId: "SEBI-02",
    kind: "deterministic",
    wording: "Scheme name must appear on first mention.",
    applicabilityReason: "Applies because scheme name is present in brief.",
  },
  {
    ruleId: "SEBI-03",
    kind: "deterministic",
    wording: "CAGR claims must name the period.",
    applicabilityReason: "Applies because performance figures include CAGR.",
  },
  {
    ruleId: "SEBI-04",
    kind: "deterministic",
    wording: "Banned promotional phrases are not permitted.",
    applicabilityReason: "Applies to all channels in this brief.",
  },
  {
    ruleId: "SEBI-05",
    kind: "deterministic",
    wording: "Performance figures require substantiation.",
    applicabilityReason: "Applies because performance figures are listed.",
  },
  {
    ruleId: "SEBI-06",
    kind: "judgement",
    wording: "Performance claims must not imply guaranteed returns.",
    applicabilityReason: "Applies because claims mention performance outcomes.",
  },
  {
    ruleId: "BRAND-02",
    kind: "judgement",
    wording: "Brand voice must stay professional.",
    applicabilityReason: "Applies because channel includes linkedin.",
  },
  {
    ruleId: "BRAND-03",
    kind: "judgement",
    wording: "Claims must not overstate fund differentiation.",
    applicabilityReason: "Applies because claims array is non-empty.",
  },
];

export const COMPILE_RESULT: CompileResponseDTO = {
  constraintSetId: CONSTRAINT_SET_ID,
  rulesetHash: RULESET_HASH,
  ruleIds: COMPILE_RULES.map((rule) => rule.ruleId),
  rules: COMPILE_RULES,
};

export const COMPILE_ZERO_RULES: CompileResponseDTO = {
  constraintSetId: "44444444-4444-4444-8444-444444444499",
  rulesetHash: "c".repeat(64),
  ruleIds: [],
  rules: [],
};

const LAST_COMPILE: LastCompileDTO = {
  constraintSetId: CONSTRAINT_SET_ID,
  rulesetHash: RULESET_HASH,
  ruleIds: COMPILE_RESULT.ruleIds,
  rules: COMPILE_RESULT.rules,
};

export const CAMPAIGN_SEED: CampaignDTO = {
  id: CAMPAIGN_ID,
  freeText:
    "Bluepeak Flexi Cap — digital campaign for retail investors. Highlight flexibility and performance with professional tone.",
  structuredBrief: SEED_BRIEF,
  currentConstraintSetId: CONSTRAINT_SET_ID,
  updatedAt: "2026-03-14T09:00:00.000Z",
  lastCompile: LAST_COMPILE,
};

export const CAMPAIGN_FRESH: CampaignDTO = {
  id: CAMPAIGN_ID_FRESH,
  freeText: "",
  structuredBrief: null,
  currentConstraintSetId: null,
  updatedAt: "2026-03-15T08:00:00.000Z",
  lastCompile: null,
};

export const CAMPAIGNS: Record<string, CampaignDTO> = {
  [CAMPAIGN_ID]: CAMPAIGN_SEED,
  [CAMPAIGN_ID_FRESH]: CAMPAIGN_FRESH,
};
