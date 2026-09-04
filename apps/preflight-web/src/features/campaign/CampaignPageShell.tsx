/**
 * CampaignPageShell — two-column layout with phase rail and page end-line.
 * Why: 09 Screen 3 max-w 1024, 32px padding, Built back link.
 */

import { Plus } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { PrimaryButton } from "@/components/ui/primary-button";
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
  isBuilt?: boolean;
  campaignName?: string;
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
  isBuilt = false,
  campaignName = "",
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
  const resolvedName = campaignName.trim() || identityLine;

  const title = isBuilt && resolvedName.length > 0 ? resolvedName : "Start a campaign";
  const eyebrow = isBuilt ? "CAMPAIGN" : undefined;

  return (
    <div className="flex min-h-below-topbar flex-col bg-ground px-8 pt-8 pb-12">
      <div className="mx-auto flex w-full max-w-register flex-1 flex-col">
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          action={
            <PrimaryButton
              loading={createInFlight}
              icon={<Plus className="size-4 shrink-0" aria-hidden="true" />}
              onClick={() => {
                void createCampaignAndGo();
              }}
            >
              New campaign
            </PrimaryButton>
          }
        />

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
