/**
 * AssetDetailStates — loading, error, and not-found shells.
 * Why: extracted from AssetDetail orchestrator for file size.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { AssetDetailShell } from "@/features/assets/AssetDetailShell";

export function LoadingState({
  showSpinner,
}: {
  showSpinner: boolean;
}): ReactElement {
  if (!showSpinner) {
    return (
      <AssetDetailShell>
        <div className="min-h-48 flex-1" />
      </AssetDetailShell>
    );
  }

  return (
    <AssetDetailShell>
      <div className="flex min-h-48 flex-1 items-center justify-center">
        <div
          className="size-4 animate-spin rounded-full border-2 border-fg border-t-transparent"
          aria-label="Loading"
        />
      </div>
    </AssetDetailShell>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }): ReactElement {
  const handleRetry = (): void => {
    onRetry?.();
  };

  return (
    <AssetDetailShell>
      <div className="flex min-h-48 flex-1 flex-col items-center justify-center gap-4">
        <p className="text-caption text-fg-muted">Could not load asset.</p>
        <Button type="button" variant="outline" onClick={handleRetry}>
          Retry
        </Button>
      </div>
    </AssetDetailShell>
  );
}

export function NotFoundState(): ReactElement {
  return (
    <AssetDetailShell>
      <div className="flex min-h-48 flex-1 items-center justify-center">
        <p className="text-caption text-fg-muted">Asset not found</p>
      </div>
    </AssetDetailShell>
  );
}
