/**
 * AssetsList — Screen 2 list page body.
 * Why: register table inside paper-ground shell (09 R2).
 */

import { useState, type ReactElement } from "react";

import { AssetsListShell } from "@/features/assets/AssetsListShell";
import { AssetsRegisterTable } from "@/features/assets/AssetsRegisterTable";
import {
  defaultRegisterFilter,
  endOfRegisterLine,
  registerCounts,
  type RegisterFilter,
  workSummaryLine,
} from "@/features/assets/register-lib";
import type { AssetsListProps } from "@/features/assets/types";
import { useCreateCampaign } from "@/features/campaign/useCreateCampaign";
import { useAssetsList } from "@/features/assets/useAssetsList";
import { usePersona } from "@/features/shell/PersonaProvider";

function EmptyState(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <p className="text-caption text-fg-muted">No assets yet</p>
      <p className="text-caption text-fg-muted">
        Start a new campaign to generate your first asset.
      </p>
    </div>
  );
}

function StageSpinner(): ReactElement {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <div
        className="size-4 animate-spin rounded-full border-2 border-fg border-t-transparent"
        aria-label="Loading"
      />
    </div>
  );
}

function PollErrorBanner({ onRetry }: { onRetry?: () => void }): ReactElement {
  const handleRetry = (): void => {
    onRetry?.();
  };

  return (
    <div className="mb-4 flex items-center justify-between gap-4 border-b border-hairline pb-3">
      <p className="text-caption text-fg-muted">
        Could not refresh assets. Showing last loaded rows.
      </p>
      <button
        type="button"
        className="inline-flex h-7 cursor-pointer items-center justify-center border border-fg bg-ground px-3 text-button-sm font-medium text-fg"
        onClick={handleRetry}
      >
        Retry
      </button>
    </div>
  );
}

function StageError({ onRetry }: { onRetry?: () => void }): ReactElement {
  const handleRetry = (): void => {
    onRetry?.();
  };

  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4">
      <p className="text-caption text-fg-muted">Could not load assets.</p>
      <button
        type="button"
        className="inline-flex h-8 cursor-pointer items-center justify-center border border-fg bg-ground px-4 text-button font-medium text-fg hover:bg-fg hover:text-surface"
        onClick={handleRetry}
      >
        Retry
      </button>
    </div>
  );
}

export function AssetsList({
  assets,
  view = "loaded",
  pollError = false,
  onRetry,
  showLoadingSpinner = true,
  createInFlight = false,
  onNewCampaign = (): void => {},
}: AssetsListProps): ReactElement {
  const { actor } = usePersona();
  const personaId = actor?.id ?? "arjun";
  const [filter, setFilter] = useState<RegisterFilter>(() =>
    defaultRegisterFilter(personaId),
  );

  const loaded = view === "loaded" && assets.length > 0;
  const workSummary = loaded ? workSummaryLine(assets) : null;
  const endLine = loaded ? endOfRegisterLine(assets) : null;
  const counts = loaded
    ? {
        needYou: registerCounts(assets).needYou,
        all: assets.length,
        resolved: registerCounts(assets).resolved,
      }
    : undefined;

  const shell = (content: ReactElement): ReactElement => (
    <AssetsListShell
      createInFlight={createInFlight}
      onNewCampaign={onNewCampaign}
      workSummary={workSummary}
      filter={filter}
      onFilterChange={setFilter}
      showFilter={loaded}
      endLine={endLine}
      counts={counts}
    >
      {content}
    </AssetsListShell>
  );

  if (view === "loading") {
    return shell(
      showLoadingSpinner ? <StageSpinner /> : <div className="min-h-48" />,
    );
  }

  if (view === "error") {
    return shell(<StageError onRetry={onRetry} />);
  }

  if (assets.length === 0) {
    return shell(<EmptyState />);
  }

  return shell(
    <>
      {pollError ? <PollErrorBanner onRetry={onRetry} /> : null}
      <AssetsRegisterTable assets={assets} filter={filter} />
    </>,
  );
}

export function AssetsListRoute(): ReactElement {
  const { assets, view, pollError, showLoadingSpinner, retry } = useAssetsList();
  const { createInFlight, createCampaignAndGo } = useCreateCampaign();

  return (
    <AssetsList
      assets={assets}
      view={view}
      pollError={pollError}
      onRetry={retry}
      showLoadingSpinner={showLoadingSpinner}
      createInFlight={createInFlight}
      onNewCampaign={() => {
        void createCampaignAndGo();
      }}
    />
  );
}
