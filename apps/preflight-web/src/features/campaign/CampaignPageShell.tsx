/**
 * CampaignPageShell — two-column layout with vertical phase rail.
 * Why: wider single-pane content without duplicate header bars (09 Screen 3).
 */

import { Loader2 } from "lucide-react";
import { useEffect, useState, type ReactElement, type ReactNode } from "react";

import {
  CampaignStepRail,
  type CampaignStepId,
} from "@/features/campaign/CampaignStepRail";
import { isStepReachable } from "@/features/campaign/lib";
import { useCreateCampaign } from "@/features/campaign/useCreateCampaign";

export interface CampaignPageShellProps {
  activeStep: CampaignStepId;
  runningStep?: CampaignStepId;
  identity?: string;
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
  runningStep,
  identity = "",
  s2Dimmed,
  s3Dimmed,
  children,
}: CampaignPageShellProps): ReactElement {
  const [viewStep, setViewStep] = useState<CampaignStepId>(activeStep);
  const { createInFlight, createCampaignAndGo } = useCreateCampaign();

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

  const handleNewCampaign = (): void => {
    void createCampaignAndGo();
  };

  const identityLine = identity.trim();

  return (
    <div className="min-h-below-topbar bg-ground px-12 pt-8 pb-12 lg:px-20 xl:px-32">
      <div className="mx-auto flex w-full max-w-campaign flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-page-title text-fg">Campaign</h1>
            {identityLine.length > 0 ? (
              <p className="text-ui text-fg-muted">{identityLine}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="inline-flex h-8 shrink-0 cursor-pointer items-center justify-center border border-fg bg-ground px-4 font-sans text-button font-medium text-fg disabled:cursor-not-allowed disabled:opacity-50"
            disabled={createInFlight}
            onClick={handleNewCampaign}
          >
            {createInFlight ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              "+ New campaign"
            )}
          </button>
        </div>
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:gap-6">
          <CampaignStepRail
            viewStep={viewStep}
            runningStep={runningStep}
            isStepReachable={(stepId) => isStepReachable(stepId, reachability)}
            onViewStepChange={handleViewStepChange}
          />
          <main className="min-w-0 flex-1">{children(viewStep)}</main>
        </div>
      </div>
    </div>
  );
}
