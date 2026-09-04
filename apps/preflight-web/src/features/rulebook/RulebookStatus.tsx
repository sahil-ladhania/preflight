/**
 * RulebookStatus — Loading spinner and error state for Rulebook.
 * Why: extracted to preserve Rulebook.tsx under 200 lines.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { RulebookShell } from "@/features/rulebook/RulebookShell";
import type { RulebookLoadingStateProps } from "@/features/rulebook/types";

export function StageSpinner(): ReactElement {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <div
        className="size-4 animate-spin rounded-full border-2 border-fg border-t-transparent"
        aria-label="Loading"
      />
    </div>
  );
}

export function StageError({ onRetry }: { onRetry?: () => void }): ReactElement {
  const handleRetry = (): void => {
    onRetry?.();
  };

  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4">
      <p className="text-caption text-fg-muted">Could not load rules.</p>
      <Button type="button" variant="outline" onClick={handleRetry}>
        Retry
      </Button>
    </div>
  );
}

export function LoadingState({ showSpinner }: RulebookLoadingStateProps): ReactElement {
  if (!showSpinner) {
    return (
      <RulebookShell postSaveCaption={false} onAdd={() => {}}>
        <div className="min-h-48" />
      </RulebookShell>
    );
  }

  return (
    <RulebookShell postSaveCaption={false} onAdd={() => {}}>
      <StageSpinner />
    </RulebookShell>
  );
}
