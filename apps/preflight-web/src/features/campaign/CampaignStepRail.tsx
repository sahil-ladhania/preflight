/**
 * CampaignStepRail — vertical Brief → Freeze → Generate phase rail.
 * Why: single-pane navigation without duplicate header bars (09 Screen 3).
 */

import { ArrowDown, Loader2 } from "lucide-react";
import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

const STEP_META = [
  {
    id: "campaign-brief",
    label: "Brief",
    defaultSubtitle: "Describe your campaign",
    ranSubtitle: "GitAgent extractor",
  },
  {
    id: "campaign-constraints",
    label: "Freeze",
    defaultSubtitle: "Compliance rules",
    ranSubtitle: "server compile",
  },
  {
    id: "campaign-generate",
    label: "Generate",
    defaultSubtitle: "Channel copy",
    ranSubtitle: "GitAgent generator",
  },
] as const;

export const CAMPAIGN_STEPS = STEP_META.map(({ id, label, defaultSubtitle }) => ({
  id,
  label,
  subtitle: defaultSubtitle,
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

function stepSubtitle(
  stepId: CampaignStepId,
  input: { briefAgentRan: boolean; compileRan: boolean; generateRan: boolean },
): string {
  const meta = STEP_META.find((step) => step.id === stepId);
  if (meta === undefined) {
    return "";
  }
  if (stepId === "campaign-brief") {
    return input.briefAgentRan ? meta.ranSubtitle : meta.defaultSubtitle;
  }
  if (stepId === "campaign-constraints") {
    return input.compileRan ? meta.ranSubtitle : meta.defaultSubtitle;
  }
  return input.generateRan ? meta.ranSubtitle : meta.defaultSubtitle;
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
  subtitle,
  state,
  running,
  onSelect,
}: {
  step: (typeof CAMPAIGN_STEPS)[number];
  subtitle: string;
  state: "active" | "complete" | "upcoming" | "locked";
  running: boolean;
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
      <span className="flex items-center gap-2">
        {running ? (
          <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden />
        ) : null}
        {step.label}
      </span>
      <span className="text-caption font-normal">{subtitle}</span>
    </button>
  );
}

export function CampaignStepRail({
  viewStep,
  runningStep,
  briefAgentRan = false,
  compileRan = false,
  generateRan = false,
  isStepReachable,
  onViewStepChange,
}: {
  viewStep: CampaignStepId;
  runningStep?: CampaignStepId;
  briefAgentRan?: boolean;
  compileRan?: boolean;
  generateRan?: boolean;
  isStepReachable: (stepId: CampaignStepId) => boolean;
  onViewStepChange: (stepId: CampaignStepId) => void;
}): ReactElement {
  const provenance = { briefAgentRan, compileRan, generateRan };
  const rail = (
    <nav
      aria-label="Campaign steps"
      className="rounded-2xl border border-border bg-canvas p-4"
    >
      <div className="flex flex-col">
        {CAMPAIGN_STEPS.map((step, index) => {
          const reachable = isStepReachable(step.id);
          const state = stepState(step.id, viewStep, reachable);
          const subtitle = stepSubtitle(step.id, provenance);

          return (
            <div key={step.id} className="flex flex-col">
              <StepButton
                step={step}
                subtitle={subtitle}
                state={state}
                running={runningStep === step.id}
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
            const subtitle = stepSubtitle(step.id, provenance);

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
                <span className="flex items-center gap-1.5">
                  {runningStep === step.id ? (
                    <Loader2 className="size-3 shrink-0 animate-spin" aria-hidden />
                  ) : null}
                  {step.label}
                </span>
                <span className="text-caption font-normal">{subtitle}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
