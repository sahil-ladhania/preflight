/**
 * RulebookStatus — loading skeleton and error state for Rulebook.
 * Why: extracted to preserve Rulebook.tsx under 200 lines.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { RulebookSkeleton } from "@/features/rulebook/RulebookSkeleton";
import { RulebookShell } from "@/features/rulebook/RulebookShell";
import type { RulebookLoadingStateProps } from "@/features/rulebook/types";

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
      <RulebookSkeleton />
    </RulebookShell>
  );
}
