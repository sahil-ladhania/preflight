/**
 * CampaignPageShell — two-column layout with phase rail and page end-line.
 * Why: 09 Screen 3 max-w 1024, 32px padding, Built back link.
 */

import { Loader2 } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  CampaignStepRail,
  type CampaignStepId,
} from "@/features/campaign/CampaignStepRail";
import { isStepReachable } from "@/features/campaign/lib";
import { useCreateCampaign } from "@/features/campaign/useCreateCampaign";

export interface CampaignPageShellProps {
  activeStep: CampaignStepId;
  compiling: boolean;
  identity?: string;
  s2Dimmed: boolean;
  s3Dimmed: boolean;
  backToSummary?: boolean;
  endLine?: string;
  onBackToSummary?: () => void;
  onRailStepChange: (stepId: CampaignStepId) => void;
  children: ReactNode;
}

export function CampaignPageShell({
  activeStep,
  compiling,
  identity = "",
  s2Dimmed,
  s3Dimmed,
  backToSummary = false,
  onBackToSummary,
  onRailStepChange,
  children,
}: CampaignPageShellProps): ReactElement {
  const { createInFlight, createCampaignAndGo } = useCreateCampaign();
  const reachability = { s2Dimmed, s3Dimmed };
  const identityLine = identity.trim();

  return (
    <div className="flex min-h-below-topbar flex-col bg-ground px-8 pt-8 pb-12">
      <div className="mx-auto flex w-full max-w-campaign flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-page-title text-fg">Campaign</h1>
            {identityLine.length > 0 ? (
              <p className="font-serif text-wordmark text-fg">{identityLine}</p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={createInFlight}
            className="h-8 rounded-none border border-fg bg-ground px-4 font-sans text-button font-medium text-fg shadow-none hover:bg-fg hover:text-surface disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              void createCampaignAndGo();
            }}
          >
            {createInFlight ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              "+ New campaign"
            )}
          </Button>
        </div>

        {backToSummary && onBackToSummary !== undefined ? (
          <button
            type="button"
            className="mt-4 w-fit cursor-pointer text-caption text-fg-muted hover:text-fg"
            onClick={onBackToSummary}
          >
            ← Back to summary
          </button>
        ) : null}

        <div className="mt-6 flex flex-1 flex-col gap-4 md:flex-row md:gap-6">
          <CampaignStepRail
            activeStep={activeStep}
            compiling={compiling}
            isStepReachable={(stepId) => isStepReachable(stepId, reachability)}
            onViewStepChange={onRailStepChange}
          />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
