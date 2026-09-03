/**
 * CampaignStepRail — vertical Brief → Freeze → Generate phase rail.
 * Why: single-pane navigation without duplicate header bars (09 Screen 3).
 */

import { Loader2 } from "lucide-react";
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
  runningStep: CampaignStepId | undefined,
): string {
  const meta = STEP_META.find((step) => step.id === stepId);
  if (meta === undefined) {
    return "";
  }
  if (
    stepId === "campaign-constraints" &&
    runningStep === "campaign-constraints"
  ) {
    return "2. Freeze — compiling…";
  }
  return meta.label;
}

function stepState(
  stepId: CampaignStepId,
  viewStep: CampaignStepId,
  reachable: boolean,
): "active" | "complete" | "upcoming" | "locked" {
  if (!reachable) {
    return "locked";
  }
  if (viewStep === stepId) {
    return "active";
  }
  if (stepIndex(stepId) < stepIndex(viewStep)) {
    return "complete";
  }
  return "upcoming";
}

function stepButtonClass(
  state: "active" | "complete" | "upcoming" | "locked",
): string {
  return cn(
    "flex shrink-0 flex-col items-start gap-0.5 border-l-2 py-2 pr-2 pl-3 text-left no-underline",
    state === "active" && "border-fg font-semibold text-fg text-ui-strong",
    state === "complete" &&
      "border-transparent font-normal text-fg hover:text-fg",
    state === "upcoming" &&
      "border-transparent font-normal text-fg-muted hover:text-fg",
    state === "locked" &&
      "pointer-events-none border-transparent font-normal text-fg-muted opacity-40",
  );
}

function StepButton({
  title,
  subtitle,
  state,
  running,
  onSelect,
  compact,
}: {
  title: string;
  subtitle: string;
  state: "active" | "complete" | "upcoming" | "locked";
  running: boolean;
  onSelect: () => void;
  compact?: boolean;
}): ReactElement {
  const locked = state === "locked";

  return (
    <button
      type="button"
      disabled={locked}
      onClick={onSelect}
      className={cn(stepButtonClass(state), compact ? "px-3" : "w-full")}
    >
      <span className="flex items-center gap-2">
        {running ? (
          <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden />
        ) : null}
        {title}
      </span>
      <span className="text-[11px] font-normal text-fg-muted">{subtitle}</span>
    </button>
  );
}

export function CampaignStepRail({
  viewStep,
  runningStep,
  isStepReachable,
  onViewStepChange,
}: {
  viewStep: CampaignStepId;
  runningStep?: CampaignStepId;
  isStepReachable: (stepId: CampaignStepId) => boolean;
  onViewStepChange: (stepId: CampaignStepId) => void;
}): ReactElement {
  const renderStep = (stepId: CampaignStepId, compact: boolean): ReactElement => {
    const meta = STEP_META.find((step) => step.id === stepId);
    if (meta === undefined) {
      return <span key={stepId} />;
    }
    const reachable = isStepReachable(stepId);
    const state = stepState(stepId, viewStep, reachable);

    return (
      <StepButton
        key={stepId}
        title={stepTitle(stepId, runningStep)}
        subtitle={meta.subtitle}
        state={state}
        running={runningStep === stepId}
        compact={compact}
        onSelect={() => onViewStepChange(stepId)}
      />
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
