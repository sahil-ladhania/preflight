/**
 * CampaignHandoffLink — Go to Campaign with hover-shift arrow.
 * Why: quiet handoff control matching empty and active composer rows.
 */

import type { ReactElement } from "react";
import { ArrowRight } from "lucide-react";

export interface CampaignHandoffLinkProps {
  onClick: () => void;
  disabled?: boolean;
}

export function CampaignHandoffLink({
  onClick,
  disabled = false,
}: CampaignHandoffLinkProps): ReactElement {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1 text-caption text-fg-muted underline hover:text-fg disabled:pointer-events-none disabled:opacity-50"
    >
      <span>Go to Campaign</span>
      <ArrowRight className="size-3" aria-hidden />
    </button>
  );
}
