/**
 * shared — constants for assets-detail fixtures.
 * Why: stable ids and hashes across A–H detail fixtures.
 */

import type { FieldOffsets, FindingDTO } from "@preflight/schemas";

export const CAMPAIGN_ID = "22222222-2222-4222-8222-222222222222";
export const CONSTRAINT_SET_ID = "33333333-3333-4333-8333-333333333333";
export const RUN_HASH = "a".repeat(64);
export const RULESET_HASH = "b".repeat(64);
export const DEMO_OPERATOR = "Demo Operator";

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
  };
}
