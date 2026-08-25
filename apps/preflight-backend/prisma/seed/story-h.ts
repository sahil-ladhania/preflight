/**
 * story-h — seed types, canonical builder, finding id helper.
 */
import type { Prisma } from "@prisma/client";

const FIELD_DELIMITER = "\n\n";

export interface AssetCopyFields {
  headline: string;
  body: string;
  disclaimer: string;
  cta: string;
}

export interface AssetSeedDef {
  letter: string;
  id: string;
  channel: string;
  copy: AssetCopyFields;
  generatedAt: string;
  regeneratedFromId: string | null;
  generationIndex: number;
}

export interface FindingSeed {
  ruleId: string;
  kind: "deterministic" | "judgement";
  evaluationStatus: "complete" | "pending" | "unavailable";
  machineVerdict: "pass" | "fail" | null;
  machineReason: string | null;
  spans: Array<{ start: number; end: number; text: string }>;
  machineAt: string | null;
  humanVerdict: "confirmed" | "waived" | null;
  humanReason: string | null;
  humanActor: string | null;
  humanAt: string | null;
}

export interface StoryHelpers {
  detPass: (ruleId: string, machineAt: string) => FindingSeed;
  detFail: (
    ruleId: string,
    reason: string,
    canonicalText: string,
    machineAt: string,
  ) => FindingSeed;
  detFailWaived: (
    ruleId: string,
    reason: string,
    canonicalText: string,
    machineAt: string,
    humanReason: string,
    humanAt: string,
  ) => FindingSeed;
  jdgPass: (ruleId: string, machineAt: string) => FindingSeed;
  jdgFailOpen: (
    ruleId: string,
    reason: string,
    spanText: string,
    canonicalText: string,
    machineAt: string,
  ) => FindingSeed;
  jdgFailConfirmed: (
    ruleId: string,
    reason: string,
    spanText: string,
    canonicalText: string,
    machineAt: string,
    humanReason: string,
    humanAt: string,
  ) => FindingSeed;
  jdgUnavailable: (ruleId: string, reason: string, machineAt: string) => FindingSeed;
}

function proofField(value: string): string {
  return value.length === 0 ? "\u200b" : value;
}

export function buildCanonicalText(fields: AssetCopyFields): {
  canonicalText: string;
  fieldOffsets: Prisma.JsonObject;
} {
  const headline = proofField(fields.headline);
  const body = proofField(fields.body);
  const disclaimer = proofField(fields.disclaimer);
  const cta = proofField(fields.cta);

  const headlineEnd = headline.length;
  const bodyStart = headlineEnd + FIELD_DELIMITER.length;
  const bodyEnd = bodyStart + body.length;
  const disclaimerStart = bodyEnd + FIELD_DELIMITER.length;
  const disclaimerEnd = disclaimerStart + disclaimer.length;
  const ctaStart = disclaimerEnd + FIELD_DELIMITER.length;
  const ctaEnd = ctaStart + cta.length;

  return {
    canonicalText: [headline, body, disclaimer, cta].join(FIELD_DELIMITER),
    fieldOffsets: {
      headline: { start: 0, end: headlineEnd },
      body: { start: bodyStart, end: bodyEnd },
      disclaimer: { start: disclaimerStart, end: disclaimerEnd },
      cta: { start: ctaStart, end: ctaEnd },
    },
  };
}

export function findingId(letter: string, ruleId: string): string {
  return `f-${letter}-${ruleId}`.padEnd(36, "0");
}
