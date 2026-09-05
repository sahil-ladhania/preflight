/**
 * CampaignPageShell — two-column layout with phase rail and page end-line.
 * Why: 09 Screen 3 max-w 1024, 32px padding, Built back link.
 */

import { ArrowLeft, Loader2, Plus } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { CampaignStepRail } from "@/features/campaign/CampaignStepRail";
import type { CampaignStepId } from "@/features/campaign/campaign-steps";
import { isStepReachable } from "@/features/campaign/lib";
import { useCreateCampaign } from "@/features/campaign/useCreateCampaign";
import { cn } from "@/lib/utils";

export interface CampaignPageShellProps {
  activeStep: CampaignStepId;
  compiling: boolean;
  identity?: string;
  campaignName?: string;
  s2Dimmed: boolean;
  s3Dimmed: boolean;
  backToSummary?: boolean;
  onBackToSummary?: () => void;
  onRailStepChange: (stepId: CampaignStepId) => void;
  children: ReactNode;
}

export function CampaignPageShell({
  activeStep,
  compiling,
  identity = "",
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

  const hasName = resolvedName.length > 0;
  const title = hasName ? resolvedName : "Start a campaign";
  const eyebrow = hasName ? "CAMPAIGN" : undefined;

  return (
    <div className="flex min-h-below-topbar flex-col bg-ground px-8 pt-8 pb-16">
      <div className="mx-auto flex w-full max-w-campaign flex-1 flex-col">
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          action={
            <button
              type="button"
              disabled={createInFlight}
              className={cn(
                "flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-none border border-fg bg-transparent px-4 font-sans text-button font-medium text-fg select-none cursor-pointer shadow-none transition-colors",
                "hover:bg-fg hover:text-surface",
                "disabled:border-hairline disabled:bg-transparent disabled:text-fg-faint disabled:cursor-not-allowed",
              )}
              onClick={() => {
                void createCampaignAndGo();
              }}
            >
              {createInFlight ? (
                <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden="true" />
              ) : (
                <Plus className="size-3.5 shrink-0" aria-hidden="true" />
              )}
              <span>New campaign</span>
            </button>
          }
        />

        {backToSummary && onBackToSummary !== undefined ? (
          <button
            type="button"
            className="mt-4 inline-flex w-fit cursor-pointer items-center gap-1.5 text-caption text-fg-muted hover:text-fg"
            onClick={onBackToSummary}
          >
            <ArrowLeft className="size-3.5 shrink-0" aria-hidden="true" />
            Back to summary
          </button>
        ) : null}

        <div className="mt-6 flex flex-1 flex-col gap-4 md:flex-row md:gap-6">
          <CampaignStepRail
            activeStep={activeStep}
            compiling={compiling}
            isStepReachable={(stepId) => isStepReachable(stepId, reachability)}
            onViewStepChange={onRailStepChange}
          />
          <main className="flex min-w-0 flex-1 flex-col">{children}</main>
        </div>

      </div>
    </div>
  );
}
