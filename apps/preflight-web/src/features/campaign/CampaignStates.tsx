/**
 * CampaignStates — loading, error, and not-found shells.
 * Why: keep Campaign.tsx under line limit.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import type {
  CampaignErrorStateProps,
  CampaignLoadingStateProps,
} from "@/features/campaign/types";

export function CampaignLoadingState({
  showSpinner,
}: CampaignLoadingStateProps): ReactElement {
  if (!showSpinner) {
    return <div className="min-h-[calc(100vh-3rem)] bg-canvas-subtle" />;
  }

  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <div
        className="size-4 animate-spin rounded-full border-2 border-fg border-t-transparent"
        aria-label="Loading"
      />
    </div>
  );
}

export function CampaignErrorState({
  onRetry,
}: CampaignErrorStateProps): ReactElement {
  const handleRetry = (): void => {
    onRetry?.();
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center gap-4">
      <p className="text-caption text-fg-muted">Could not load campaign.</p>
      <Button type="button" variant="outline" onClick={handleRetry}>
        Retry
      </Button>
    </div>
  );
}

export function CampaignNotFoundState(): ReactElement {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <p className="text-caption text-fg-muted">Campaign not found</p>
    </div>
  );
}
