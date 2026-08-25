/**
 * CampaignStepRail — vertical Brief → Freeze → Generate phase rail.
 * Why: single-pane navigation without duplicate header bars (09 Screen 3).
 */

import { ArrowDown } from "lucide-react";
import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

export const CAMPAIGN_STEPS = [
  {
    id: "campaign-brief",
    label: "Brief",
    subtitle: "Structure your brief",
  },
  {
    id: "campaign-constraints",
    label: "Freeze",
    subtitle: "See which rules apply",
  },
  {
    id: "campaign-generate",
    label: "Generate",
    subtitle: "Create channel copy",
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

function stepIndex(stepId: CampaignStepId): number {
  return CAMPAIGN_STEPS.findIndex((step) => step.id === stepId);
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

function StepButton({
  step,
  state,
  onSelect,
}: {
  step: (typeof CAMPAIGN_STEPS)[number];
  state: "active" | "complete" | "upcoming" | "locked";
  onSelect: () => void;
}): ReactElement {
  const locked = state === "locked";

  return (
    <button
      type="button"
      disabled={locked}
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col items-start gap-0.5 rounded-md border-l-2 py-2 pr-2 pl-3 text-left text-ui no-underline",
        state === "active" && "border-primary font-semibold text-primary",
        state === "complete" &&
          "border-transparent font-normal text-fg hover:text-primary",
        state === "upcoming" &&
          "border-transparent font-normal text-fg-muted hover:text-primary",
        locked &&
          "pointer-events-none border-transparent font-normal text-fg-muted opacity-40",
      )}
    >
      <span>{step.label}</span>
      <span className="text-caption font-normal">{step.subtitle}</span>
    </button>
  );
}

export function CampaignStepRail({
  viewStep,
  isStepReachable,
  onViewStepChange,
}: {
  viewStep: CampaignStepId;
  isStepReachable: (stepId: CampaignStepId) => boolean;
  onViewStepChange: (stepId: CampaignStepId) => void;
}): ReactElement {
  const rail = (
    <nav
      aria-label="Campaign steps"
      className="rounded-2xl border border-border bg-canvas p-4"
    >
      <div className="flex flex-col">
        {CAMPAIGN_STEPS.map((step, index) => {
          const reachable = isStepReachable(step.id);
          const state = stepState(step.id, viewStep, reachable);

          return (
            <div key={step.id} className="flex flex-col">
              <StepButton
                step={step}
                state={state}
                onSelect={() => onViewStepChange(step.id)}
              />
              {index < CAMPAIGN_STEPS.length - 1 ? (
                <ArrowDown
                  className="my-1 ml-4 size-4 text-fg-muted"
                  aria-hidden
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </nav>
  );

  return (
    <>
      <aside className="hidden w-56 shrink-0 md:block">{rail}</aside>
      <div className="md:hidden">
        <nav
          aria-label="Campaign steps"
          className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-canvas p-3"
        >
          {CAMPAIGN_STEPS.map((step) => {
            const reachable = isStepReachable(step.id);
            const state = stepState(step.id, viewStep, reachable);

            return (
              <button
                key={step.id}
                type="button"
                disabled={!reachable}
                onClick={() => onViewStepChange(step.id)}
                className={cn(
                  "flex shrink-0 flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left text-ui no-underline",
                  state === "active" && "bg-canvas-subtle font-semibold text-primary",
                  state === "complete" &&
                    "font-normal text-fg hover:bg-canvas-subtle hover:text-primary",
                  state === "upcoming" &&
                    "font-normal text-fg-muted hover:bg-canvas-subtle hover:text-primary",
                  !reachable && "pointer-events-none text-fg-muted opacity-40",
                )}
              >
                <span>{step.label}</span>
                <span className="text-caption font-normal">{step.subtitle}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
