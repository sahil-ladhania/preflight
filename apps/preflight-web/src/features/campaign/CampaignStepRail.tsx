/**
 * CampaignStepRail — vertical Brief → Freeze → Generate phase rail.
 * Why: outcome subtitles and active 2px fg left rule (08 §5.15).
 */

import type { ReactElement } from "react";

import { CAMPAIGN_STEPS, stepTitle, type CampaignStepId } from "@/features/campaign/campaign-steps";
import { cn } from "@/lib/utils";

export type { CampaignStepId };

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
    const meta = CAMPAIGN_STEPS.find((step) => step.id === stepId);
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
          "relative flex shrink-0 flex-col items-start gap-0.5 py-1.5 pr-2 text-left transition-none",
          compact ? "px-3" : "w-full",
          !reachable && "pointer-events-none opacity-40",
          reachable && !isActive && "cursor-pointer hover:text-fg",
        )}
      >
        {!compact && isActive ? (
          <span
            className="absolute -left-4 top-0 bottom-0 w-[2px] bg-primary"
            aria-hidden="true"
          />
        ) : null}
        <span
          className={cn(
            "text-ui tracking-tight",
            isActive ? "font-semibold text-fg" : "font-normal text-fg-muted",
          )}
        >
          {stepTitle(stepId, compiling)}
        </span>
        <span className="text-[11px] font-normal text-fg-muted">{meta.subtitle}</span>
      </button>
    );
  };

  return (
    <>
      <aside className="hidden w-[180px] shrink-0 md:block">
        <nav aria-label="Campaign steps" className="relative flex flex-col gap-5 pl-4">
          <div
            className="pointer-events-none absolute left-0 top-2 bottom-2 w-px bg-hairline"
            aria-hidden="true"
          />
          {CAMPAIGN_STEPS.map((step) => renderStep(step.id, false))}
        </nav>
      </aside>
      <div className="md:hidden">
        <nav
          aria-label="Campaign steps"
          className="flex gap-2 overflow-x-auto pb-1 border-b border-hairline"
        >
          {CAMPAIGN_STEPS.map((step) => renderStep(step.id, true))}
        </nav>
      </div>
    </>
  );
}
