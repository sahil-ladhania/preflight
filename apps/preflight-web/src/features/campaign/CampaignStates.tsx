/**
 * CampaignStates — loading, error, and not-found shells.
 * Why: keep Campaign.tsx under line limit.
 */

import type { ReactElement } from "react";

import { CampaignSkeleton } from "@/features/campaign/CampaignSkeleton";
import type {
  CampaignErrorStateProps,
  CampaignLoadingStateProps,
} from "@/features/campaign/types";

export function CampaignLoadingState({
  showSpinner,
}: CampaignLoadingStateProps): ReactElement {
  if (!showSpinner) {
    return <div className="min-h-below-topbar bg-ground" />;
  }

  return <CampaignSkeleton />;
}

export function CampaignErrorState({
  onRetry,
}: CampaignErrorStateProps): ReactElement {
  const handleRetry = (): void => {
    onRetry?.();
  };

  return (
    <div className="flex min-h-below-topbar flex-col items-center justify-center gap-4">
      <p className="text-caption text-fg-muted">Could not load campaign.</p>
      <button
        type="button"
        className="inline-flex h-8 cursor-pointer items-center justify-center border border-fg px-4 font-sans text-button font-medium text-fg"
        onClick={handleRetry}
      >
        Retry
      </button>
    </div>
  );
}

export function CampaignNotFoundState(): ReactElement {
  return (
    <div className="flex min-h-below-topbar items-center justify-center">
      <p className="text-caption text-fg-muted">Campaign not found</p>
    </div>
  );
}
