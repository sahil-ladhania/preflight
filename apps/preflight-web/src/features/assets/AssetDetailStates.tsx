/**
 * AssetDetailStates — loading, error, and not-found shells.
 * Why: extracted from AssetDetail orchestrator for file size.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";

export function LoadingState({
  showSpinner,
}: {
  showSpinner: boolean;
}): ReactElement {
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

export function ErrorState({ onRetry }: { onRetry?: () => void }): ReactElement {
  const handleRetry = (): void => {
    onRetry?.();
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center gap-4">
      <p className="text-caption text-fg-muted">Could not load asset.</p>
      <Button type="button" variant="outline" onClick={handleRetry}>
        Retry
      </Button>
    </div>
  );
}

export function NotFoundState(): ReactElement {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <p className="text-caption text-fg-muted">Asset not found</p>
    </div>
  );
}
