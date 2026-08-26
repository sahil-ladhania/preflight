/**
 * shared — constants for assets-detail fixtures.
 * Why: stable ids and hashes across A–H detail fixtures.
 */

import type { BrandKitDTO, FieldOffsets, FindingDTO } from "@preflight/schemas";

export const CAMPAIGN_ID = "22222222-2222-4222-8222-222222222222";
export const CONSTRAINT_SET_ID = "33333333-3333-4333-8333-333333333333";
export const RUN_HASH = "a".repeat(64);
export const RULESET_HASH = "b".repeat(64);
export const KIT_FINGERPRINT =
  "ee486f142f8f420347a9e9f4aff59bfbadae6960bad38495cf7133877740f306";
export const DEMO_OPERATOR = "Demo Operator";

export const BLUEPEAK_BRAND_KIT: BrandKitDTO = {
  kitId: "bluepeak-v1",
  clientName: "Bluepeak Asset Management",
  voice: {
    tone: "Professional, credible, no hype",
    do: [
      "Use scheme name and category accurately",
      "Substantiate performance claims with period labels",
      "Keep copy informative and restrained",
    ],
    dont: [
      "Guarantee returns or promise fixed outcomes",
      "Use superlatives like only, best, or guaranteed",
      "Create urgency or fear-based pressure",
    ],
  },
  forbiddenClaims: [
    "guaranteed returns",
    "fixed returns",
    "risk-free",
    "assured profit",
  ],
  requiredDisclaimer:
    "Mutual fund investments are subject to market risks. Read all scheme related documents carefully.",
  typography: {
    headingRole: "Georgia, 'Times New Roman', serif",
    bodyRole: "system-ui, -apple-system, sans-serif",
  },
  colors: {
    primary: "#1a4d8f",
    secondary: "#2d6cb5",
    background: "#f4f7fb",
  },
  channelHints: {
    email: {
      maxHeadlineChars: 80,
      layoutNotes: "Newsletter block: headline, body, disclaimer footer, CTA button",
    },
    linkedin: {
      maxHeadlineChars: 120,
      layoutNotes: "Card: headline hook, body paragraph, disclaimer line, CTA link",
    },
    display: {
      maxHeadlineChars: 60,
      layoutNotes: "Banner: short headline, one-line body, disclaimer strip, CTA",
    },
    whatsapp: {
      maxHeadlineChars: 40,
      layoutNotes: "Short broadcast: headline, brief body, disclaimer, CTA",
    },
    landing: {
      maxHeadlineChars: 70,
      layoutNotes: "Hero: headline, subtext body, disclaimer below fold, CTA",
    },
  },
};

export const ASSET_KIT_FIELDS = {
  kitFingerprint: KIT_FINGERPRINT,
  brandKit: BLUEPEAK_BRAND_KIT,
  generatorRun: null,
} as const;

export const FIELD_OFFSETS: FieldOffsets = {
  headline: { start: 0, end: 48 },
  body: { start: 48, end: 220 },
  disclaimer: { start: 220, end: 320 },
  cta: { start: 320, end: 360 },
};

export const FROZEN_WORDING = {
  "SEBI-01":
    "Standard risk disclaimer must appear in the asset copy.",
  "SEBI-02": "Scheme name must appear on first mention.",
  "SEBI-03": "CAGR claims must name the period.",
  "SEBI-04": "Banned promotional phrases are not permitted.",
  "SEBI-05": "Performance figures require substantiation.",
  "SEBI-06":
    "Performance claims must not imply guaranteed returns.",
  "BRAND-02": "Brand voice must stay professional.",
  "BRAND-03": "Claims must not overstate fund differentiation.",
  "BRAND-04": "Logo usage must follow brand guidelines.",
  "BRAND-05": "Tone must match approved channel norms.",
} as const satisfies Record<string, string>;

export type FrozenRuleId = keyof typeof FROZEN_WORDING;

export function findingId(assetLetter: string, ruleId: string): string {
  return `f-${assetLetter}-${ruleId}`.padEnd(36, "0");
}

export function passFinding(
  assetLetter: string,
  ruleId: string,
  kind: FindingDTO["kind"],
): FindingDTO {
  return {
    id: findingId(assetLetter, ruleId),
    ruleId,
    kind,
    frozenWording: FROZEN_WORDING[ruleId as FrozenRuleId] ?? ruleId,
    evaluationStatus: "complete",
    machineVerdict: "pass",
    machineReason: null,
    spans: [],
    machineAt: "2026-03-14T10:00:00.000Z",
    humanVerdict: null,
    humanReason: null,
    humanActor: null,
    humanAt: null,
    judgeRun: null,
  };
}
