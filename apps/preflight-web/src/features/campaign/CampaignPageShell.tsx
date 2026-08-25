/**
 * CampaignPageShell — two-column layout with vertical phase rail.
 * Why: wider single-pane content without duplicate header bars (09 Screen 3).
 */

import { useEffect, useState, type ReactElement, type ReactNode } from "react";

import {
  CampaignStepRail,
  type CampaignStepId,
} from "@/features/campaign/CampaignStepRail";
import { isStepReachable } from "@/features/campaign/lib";

export interface CampaignPageShellProps {
  activeStep: CampaignStepId;
  s2Dimmed: boolean;
  s3Dimmed: boolean;
  children: (viewStep: CampaignStepId) => ReactNode;
}

const STEP_ORDER: CampaignStepId[] = [
  "campaign-brief",
  "campaign-constraints",
  "campaign-generate",
];

function stepIndex(stepId: CampaignStepId): number {
  return STEP_ORDER.indexOf(stepId);
}

export function CampaignPageShell({
  activeStep,
  s2Dimmed,
  s3Dimmed,
  children,
}: CampaignPageShellProps): ReactElement {
  const [viewStep, setViewStep] = useState<CampaignStepId>(activeStep);

  useEffect(() => {
    setViewStep((current) => {
      if (stepIndex(activeStep) > stepIndex(current)) {
        return activeStep;
      }
      return current;
    });
  }, [activeStep]);

  const reachability = { s2Dimmed, s3Dimmed };

  const handleViewStepChange = (stepId: CampaignStepId): void => {
    if (!isStepReachable(stepId, reachability)) {
      return;
    }
    setViewStep(stepId);
  };

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-canvas-subtle p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:gap-6">
        <CampaignStepRail
          viewStep={viewStep}
          isStepReachable={(stepId) => isStepReachable(stepId, reachability)}
          onViewStepChange={handleViewStepChange}
        />
        <main className="min-w-0 flex-1">
          <h1 className="text-title text-fg">Campaign</h1>
          <p className="text-caption text-fg-muted">
            Paste a brief, structure it, compile rules, generate assets.
          </p>
          <div className="mt-6 rounded-2xl border border-border bg-canvas p-6">
            {children(viewStep)}
          </div>
        </main>
      </div>
    </div>
  );
}
