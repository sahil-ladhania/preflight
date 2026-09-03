/**
 * lib — campaign-only helpers.
 * Why: brief defaults, dirty check, generate gate captions.
 */

import { StructuredBriefSchema } from "@preflight/schemas";
import type {
  BriefField,
  CampaignDTO,
  Channel,
  CompileResponseDTO,
  StructuredBriefInput,
} from "@preflight/schemas";

import type { CampaignStepId } from "@/features/campaign/CampaignStepRail";

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
  placeholder: string;
}> = [
  {
    key: "objective",
    label: "Objective",
    placeholder: "e.g. Drive awareness among digital investors",
  },
  {
    key: "schemeName",
    label: "Scheme name",
    placeholder: "e.g. Bluepeak Flexi Cap Fund",
  },
  {
    key: "schemeCategory",
    label: "Scheme category",
    placeholder: "e.g. Flexi Cap",
  },
  {
    key: "audience",
    label: "Audience",
    placeholder: "e.g. Retail investors in metro India",
  },
  {
    key: "market",
    label: "Market",
    placeholder: "e.g. India",
  },
];

export const BRIEF_FREE_TEXT_PLACEHOLDER =
  "Describe your campaign in plain language…";

export const CAMPAIGN_INPUT_CLASS =
  "h-auto border border-hairline bg-transparent px-3 py-2 font-serif text-copy text-fg not-italic placeholder:not-italic placeholder:text-fg-faint shadow-none focus-visible:border-decision focus-visible:outline-none focus-visible:ring-0";

export const CAMPAIGN_INPUT_PROPOSED_CLASS =
  "h-auto border border-dashed border-hairline bg-transparent px-3 py-2 font-serif text-copy text-fg not-italic placeholder:not-italic placeholder:text-fg-faint shadow-none focus-visible:border-decision focus-visible:outline-none focus-visible:ring-0";

export const CAMPAIGN_INPUT_FILLED_CLASS =
  "h-auto border border-hairline bg-transparent px-3 py-2 font-serif text-copy text-fg shadow-none focus-visible:border-decision focus-visible:outline-none focus-visible:ring-0";

export const CAMPAIGN_INPUT_MISSING_CLASS =
  "h-auto border border-dashed border-hairline bg-transparent px-3 py-2 font-serif text-copy text-fg not-italic placeholder:not-italic placeholder:text-fg-faint shadow-none focus-visible:border-decision focus-visible:outline-none focus-visible:ring-0";

export const CAMPAIGN_TEXTAREA_CLASS =
  "min-h-brief w-full resize-none rounded-none border border-border bg-transparent px-4 py-3.5 font-serif text-copy text-fg not-italic placeholder:not-italic placeholder:text-fg-faint shadow-none focus-visible:border-decision focus-visible:outline-none focus-visible:ring-0";

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

export function hydrateFromCampaign(data: CampaignDTO): {
  freeText: string;
  brief: StructuredBriefInput;
  savedBrief: StructuredBriefInput;
  briefSaved: boolean;
  compileResult: CompileResponseDTO | null;
} {
  const brief = briefFromCampaign(data.structuredBrief);
  return {
    freeText: data.freeText,
    brief,
    savedBrief: brief,
    briefSaved: data.structuredBrief !== null,
    compileResult: data.lastCompile,
  };
}

export function briefEquals(
  left: StructuredBriefInput,
  right: StructuredBriefInput,
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function normalizeBrief(
  brief: StructuredBriefInput,
): StructuredBriefInput {
  return {
    ...brief,
    performanceFigures: brief.performanceFigures.filter(
      (row) =>
        !(row.value.trim().length === 0 && row.period.trim().length === 0),
    ),
    claims: brief.claims.filter((claim) => claim.trim().length > 0),
  };
}

export function briefIsValid(brief: StructuredBriefInput): boolean {
  return StructuredBriefSchema.safeParse(normalizeBrief(brief)).success;
}

export function briefHasDraftContent(
  freeText: string,
  brief: StructuredBriefInput,
): boolean {
  if (freeText.trim().length > 0) {
    return true;
  }
  if (brief.objective.trim().length > 0) {
    return true;
  }
  if (brief.schemeName.trim().length > 0) {
    return true;
  }
  if (brief.schemeCategory.trim().length > 0) {
    return true;
  }
  if (brief.audience.trim().length > 0) {
    return true;
  }
  if (brief.market.trim().length > 0) {
    return true;
  }
  if (brief.channels.length > 0) {
    return true;
  }
  if (brief.performanceFigures.length > 0) {
    return true;
  }
  if (brief.claims.length > 0) {
    return true;
  }
  return false;
}

export function saveDisabledCaption(input: {
  saveDisabled: boolean;
  briefDirty: boolean;
  briefSaved: boolean;
}): string | null {
  if (!input.saveDisabled) {
    return null;
  }
  if (!input.briefDirty && input.briefSaved) {
    return "No changes to save.";
  }
  return "Complete required fields before saving.";
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

export function isStepReachable(
  stepId: CampaignStepId,
  input: { s2Dimmed: boolean; s3Dimmed: boolean },
): boolean {
  if (stepId === "campaign-brief") {
    return true;
  }
  if (stepId === "campaign-constraints") {
    return !input.s2Dimmed;
  }
  return !input.s3Dimmed;
}

export function campaignGateState(input: {
  brief: StructuredBriefInput;
  savedBrief: StructuredBriefInput;
  briefSaved: boolean;
  compileResult: CompileResponseDTO | null;
  emptySetAcknowledged: boolean;
  generateInFlight: boolean;
}): {
  briefDirty: boolean;
  s2Dimmed: boolean;
  s3Dimmed: boolean;
  staleBanner: boolean;
  saveDisabled: boolean;
  saveDisabledCaption: string | null;
  generateCaption: string | null;
  generateDisabled: boolean;
} {
  const briefDirty = !briefEquals(input.brief, input.savedBrief);
  const s2Dimmed = !input.briefSaved;
  const s3Dimmed = input.compileResult === null;
  const staleBanner = input.compileResult !== null && briefDirty;
  const saveDisabled =
    !briefIsValid(input.brief) || (!briefDirty && input.briefSaved);
  const saveCaption = saveDisabledCaption({
    saveDisabled,
    briefDirty,
    briefSaved: input.briefSaved,
  });
  const generateCaption = generateDisabledCaption({
    s3Dimmed,
    ruleCount: input.compileResult?.ruleIds.length ?? 0,
    emptySetAcknowledged: input.emptySetAcknowledged,
    briefDirty,
    generateInFlight: input.generateInFlight,
  });
  const generateDisabled = generateCaption !== null;

  return {
    briefDirty,
    s2Dimmed,
    s3Dimmed,
    staleBanner,
    saveDisabled,
    saveDisabledCaption: saveCaption,
    generateCaption,
    generateDisabled,
  };
}

export const INJECTION_BANNER_COPY =
  "Brief contained override language — logged.";
