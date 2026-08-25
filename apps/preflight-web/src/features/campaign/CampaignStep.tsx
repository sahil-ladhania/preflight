/**
 * CampaignStep — phase subtitle wrapper for single-pane content.
 * Why: step names live in the rail; main pane shows phase copy only.
 */

import type { ReactElement } from "react";

import type { CampaignStepProps } from "@/features/campaign/types";

export function CampaignStep({
  subtitle,
  children,
}: CampaignStepProps): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {subtitle !== undefined ? (
        <p className="text-caption text-fg-muted">{subtitle}</p>
      ) : null}
      {children}
    </div>
  );
}
