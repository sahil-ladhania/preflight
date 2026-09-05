/**
 * campaign-steps — Step rail navigation types, definitions, and active step logic.
 * Why: extracted from CampaignStepRail to eliminate react-refresh/only-export-components
 * and keep CampaignStepRail as a pure component.
 */

export const CAMPAIGN_STEPS = [
  {
    id: "campaign-brief",
    label: "1. Brief",
    subtitle: "What you're campaigning for",
  },
  {
    id: "campaign-constraints",
    label: "2. Freeze",
    subtitle: "Rules that will govern this campaign",
  },
  {
    id: "campaign-generate",
    label: "3. Generate",
    subtitle: "Channel copy, checked against the freeze",
  },
] as const;

export type CampaignStepId = (typeof CAMPAIGN_STEPS)[number]["id"];

export function activeCampaignStep(input: {
  briefSaved: boolean;
  compileDone: boolean;
}): CampaignStepId {
  if (!input.briefSaved) {
    return "campaign-brief";
  }
  if (!input.compileDone) {
    return "campaign-constraints";
  }
  return "campaign-generate";
}

export function stepIndexForId(stepId: CampaignStepId): number {
  return CAMPAIGN_STEPS.findIndex((step) => step.id === stepId);
}

export function stepTitle(
  stepId: CampaignStepId,
  compiling: boolean,
): string {
  const meta = CAMPAIGN_STEPS.find((step) => step.id === stepId);
  if (meta === undefined) {
    return "";
  }
  if (stepId === "campaign-constraints" && compiling) {
    return "2. Freeze — compiling…";
  }
  return meta.label;
}
