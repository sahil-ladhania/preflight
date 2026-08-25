/**
 * CampaignPageShell — full-bleed chrome with 720px content column.
 * Why: avoids narrow island on canvas background (09 airy route).
 */

import type { ReactElement, ReactNode } from "react";

import { CampaignPageHeader } from "@/features/campaign/CampaignPageHeader";
import {
  CampaignStepNav,
  type CampaignStepId,
} from "@/features/campaign/CampaignStepNav";

export interface CampaignPageShellProps {
  activeStep: CampaignStepId;
  children: ReactNode;
  generateFooter?: ReactNode;
}

export function CampaignPageShell({
  activeStep,
  children,
  generateFooter,
}: CampaignPageShellProps): ReactElement {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col bg-canvas-subtle">
      <CampaignPageHeader />
      <CampaignStepNav activeStep={activeStep} />
      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col gap-6 px-8 py-6">
        {children}
      </div>
      {generateFooter ?? null}
    </div>
  );
}
