/**
 * lib — campaign-only helpers.
 * Why: brief defaults, dirty check, generate gate captions.
 */

import { StructuredBriefSchema } from "@preflight/schemas";
import type { BriefField, Channel, StructuredBriefInput } from "@preflight/schemas";

export const CHANNEL_OPTIONS: Channel[] = [
  "email",
  "linkedin",
  "display",
  "whatsapp",
  "landing",
];

export const BRIEF_SCALAR_FIELDS: Array<{
  key: BriefField;
  label: string;
}> = [
  { key: "objective", label: "Objective" },
  { key: "schemeName", label: "Scheme name" },
  { key: "schemeCategory", label: "Scheme category" },
  { key: "audience", label: "Audience" },
  { key: "market", label: "Market" },
];

export function emptyBrief(): StructuredBriefInput {
  return {
    objective: "",
    schemeName: "",
    schemeCategory: "",
    audience: "",
    channels: [],
    market: "",
    performanceFigures: [],
    claims: [],
  };
}

export function briefFromCampaign(
  structuredBrief: StructuredBriefInput | null,
): StructuredBriefInput {
  if (structuredBrief === null) {
    return emptyBrief();
  }
  return structuredBrief;
}

export function briefEquals(
  left: StructuredBriefInput,
  right: StructuredBriefInput,
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function briefIsValid(brief: StructuredBriefInput): boolean {
  return StructuredBriefSchema.safeParse(brief).success;
}

export function shortHash(hash: string): string {
  return hash.slice(0, 8);
}

export function generateDisabledCaption(params: {
  s3Dimmed: boolean;
  ruleCount: number;
  emptySetAcknowledged: boolean;
  briefDirty: boolean;
  generateInFlight: boolean;
}): string | null {
  if (params.generateInFlight) {
    return null;
  }
  if (params.s3Dimmed) {
    return "Compile a constraint set first.";
  }
  if (params.briefDirty) {
    return "Save brief before generating.";
  }
  if (params.ruleCount === 0 && !params.emptySetAcknowledged) {
    return "No rules apply — adjust the brief or acknowledge an empty set.";
  }
  return null;
}

export function mergeExtractProposal(
  brief: StructuredBriefInput,
  proposal: Partial<StructuredBriefInput>,
): StructuredBriefInput {
  return {
    ...brief,
    ...proposal,
    channels: proposal.channels ?? brief.channels,
    performanceFigures:
      proposal.performanceFigures ?? brief.performanceFigures,
    claims: proposal.claims ?? brief.claims,
  };
}

export function proposedKeysFromPartial(
  proposal: Partial<StructuredBriefInput>,
): Set<BriefField> {
  const keys = new Set<BriefField>();
  for (const key of Object.keys(proposal) as BriefField[]) {
    keys.add(key);
  }
  return keys;
}
