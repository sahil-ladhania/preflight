/**
 * CampaignStepRail — vertical Brief → Freeze → Generate phase rail.
 * Why: outcome subtitles and active 2px fg left rule (08 §5.15).
 */

import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

const STEP_META = [
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

export const CAMPAIGN_STEPS = STEP_META.map(({ id, label, subtitle }) => ({
  id,
  label,
  subtitle,
}));

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

function stepIndex(stepId: CampaignStepId): number {
  return STEP_META.findIndex((step) => step.id === stepId);
}

function stepTitle(
  stepId: CampaignStepId,
  compiling: boolean,
): string {
  const meta = STEP_META.find((step) => step.id === stepId);
  if (meta === undefined) {
    return "";
  }
  if (stepId === "campaign-constraints" && compiling) {
    return "2. Freeze — compiling…";
  }
  return meta.label;
}

export function CampaignStepRail({
  activeStep,
  compiling,
  isStepReachable,
  onViewStepChange,
}: {
  activeStep: CampaignStepId;
  compiling: boolean;
  isStepReachable: (stepId: CampaignStepId) => boolean;
  onViewStepChange: (stepId: CampaignStepId) => void;
}): ReactElement {
  const renderStep = (stepId: CampaignStepId, compact: boolean): ReactElement => {
    const meta = STEP_META.find((step) => step.id === stepId);
    if (meta === undefined) {
      return <span key={stepId} />;
    }
    const reachable = isStepReachable(stepId);
    const isActive = activeStep === stepId;

    return (
      <button
        key={stepId}
        type="button"
        disabled={!reachable}
        onClick={() => onViewStepChange(stepId)}
        className={cn(
          "flex shrink-0 flex-col items-start gap-0.5 border-l-2 py-2 pr-2 pl-3 text-left",
          compact ? "px-3" : "w-full",
          isActive
            ? "border-fg font-semibold text-fg text-ui-strong"
            : "border-hairline font-normal text-fg-muted",
          !reachable && "pointer-events-none opacity-40",
          reachable && !isActive && "cursor-pointer hover:text-fg",
        )}
      >
        <span>{stepTitle(stepId, compiling)}</span>
        <span className="text-[11px] font-normal text-fg-muted">{meta.subtitle}</span>
      </button>
    );
  };

  return (
    <>
      <aside className="hidden w-[180px] shrink-0 md:block">
        <nav aria-label="Campaign steps" className="flex flex-col gap-5">
          {STEP_META.map((step) => renderStep(step.id, false))}
        </nav>
      </aside>
      <div className="md:hidden">
        <nav
          aria-label="Campaign steps"
          className="flex gap-2 overflow-x-auto pb-1"
        >
          {STEP_META.map((step) => renderStep(step.id, true))}
        </nav>
      </div>
    </>
  );
}

export function stepIndexForId(stepId: CampaignStepId): number {
  return stepIndex(stepId);
}
