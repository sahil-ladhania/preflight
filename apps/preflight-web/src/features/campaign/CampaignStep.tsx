/**
 * CampaignStep — phase subtitle wrapper for single-pane content.
 * Why: step names live in the rail; main pane shows phase copy and narration.
 */

import type { ReactElement } from "react";

import type { CampaignStepProps } from "@/features/campaign/types";
import { CommentSheet } from "@/features/workbench/CommentSheet";

export function CampaignStep({
  subtitle,
  narration,
  children,
}: CampaignStepProps): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      {subtitle !== undefined ? (
        <p className="text-caption text-fg-muted">{subtitle}</p>
      ) : null}
      {narration !== undefined && narration !== null ? (
        <CommentSheet label="Agent">
          <p className="whitespace-pre-line text-body text-fg">{narration}</p>
        </CommentSheet>
      ) : null}
      {children}
    </div>
  );
}
