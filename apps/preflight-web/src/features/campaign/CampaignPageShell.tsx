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
  runningStep?: CampaignStepId;
  s2Dimmed: boolean;
  s3Dimmed: boolean;
  briefAgentRan?: boolean;
  compileRan?: boolean;
  generateRan?: boolean;
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
  runningStep,
  s2Dimmed,
  s3Dimmed,
  briefAgentRan = false,
  compileRan = false,
  generateRan = false,
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
    <div className="min-h-below-topbar bg-ground p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-campaign flex-col gap-4 md:flex-row md:gap-6">
        <CampaignStepRail
          viewStep={viewStep}
          runningStep={runningStep}
          briefAgentRan={briefAgentRan}
          compileRan={compileRan}
          generateRan={generateRan}
          isStepReachable={(stepId) => isStepReachable(stepId, reachability)}
          onViewStepChange={handleViewStepChange}
        />
        <main className="min-w-0 flex-1">
          <h1 className="text-title text-fg">Campaign</h1>
          <p className="text-caption text-fg-muted">
            Describe a brief, click Build it, freeze rules, generate copy.
          </p>
          <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
            {children(viewStep)}
          </div>
        </main>
      </div>
    </div>
  );
}
