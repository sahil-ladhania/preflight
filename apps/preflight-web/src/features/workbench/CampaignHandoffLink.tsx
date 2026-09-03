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
      className="group flex cursor-pointer items-center gap-1.5 text-caption text-primary disabled:pointer-events-none disabled:opacity-50"
    >
      <span className="underline decoration-primary decoration-dotted underline-offset-4 transition-colors group-hover:decoration-primary">
        Go to Campaign
      </span>
      <ArrowRight
        className="size-3.5 transition-transform duration-150 group-hover:translate-x-1"
        aria-hidden
      />
    </button>
  );
}
