/**
 * AssetsList — Screen 2 list page body.
 * Why: assets ledger entry list inside PageStage shell.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { AssetListRow } from "@/features/assets/AssetListRow";
import { AssetsListShell } from "@/features/assets/AssetsListShell";
import type { AssetsListProps } from "@/features/assets/types";
import { useCreateCampaign } from "@/features/campaign/useCreateCampaign";
import { useAssetsList } from "@/features/assets/useAssetsList";
import { cn } from "@/lib/utils";

function ListHeaderRow(): ReactElement {
  return (
    <div
      className={cn(
        "sticky top-0 grid grid-cols-[132px_minmax(0,1fr)_minmax(0,1fr)_168px_96px] items-center gap-4",
        "border-b border-border bg-canvas-subtle px-4 py-2",
      )}
    >
      <span className="text-caption text-fg-muted">Status</span>
      <span className="text-caption text-fg-muted">Headline</span>
      <span className="text-caption text-fg-muted">Why</span>
      <span className="text-caption text-fg-muted">Generated</span>
      <span className="text-caption text-fg-muted">Version</span>
    </div>
  );
}

function EmptyState(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-2 bg-canvas py-16">
      <p className="text-caption text-fg-muted">No assets yet</p>
      <p className="text-caption text-fg-muted">
        Start a new campaign to generate your first asset.
      </p>
    </div>
  );
}

function StageSpinner(): ReactElement {
  return (
    <div className="flex min-h-48 items-center justify-center bg-canvas">
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
    <div className="flex items-center justify-between gap-4 border-b border-border bg-canvas-subtle px-4 py-2">
      <p className="text-caption text-fg-muted">
        Could not refresh assets. Showing last loaded rows.
      </p>
      <Button type="button" variant="outline" size="sm" onClick={handleRetry}>
        Retry
      </Button>
    </div>
  );
}

function StageError({ onRetry }: { onRetry?: () => void }): ReactElement {
  const handleRetry = (): void => {
    onRetry?.();
  };

  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-4 bg-canvas">
      <p className="text-caption text-fg-muted">Could not load assets.</p>
      <Button type="button" variant="outline" onClick={handleRetry}>
        Retry
      </Button>
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
  const shell = (content: ReactElement): ReactElement => (
    <AssetsListShell
      createInFlight={createInFlight}
      onNewCampaign={onNewCampaign}
    >
      {content}
    </AssetsListShell>
  );

  if (view === "loading") {
    return shell(showLoadingSpinner ? <StageSpinner /> : <div className="min-h-48 bg-canvas" />);
  }

  if (view === "error") {
    return shell(<StageError onRetry={onRetry} />);
  }

  if (assets.length === 0) {
    return shell(<EmptyState />);
  }

  return shell(
    <div className="bg-canvas">
      {pollError ? <PollErrorBanner onRetry={onRetry} /> : null}
      <ListHeaderRow />
      {assets.map((asset) => (
        <AssetListRow key={asset.id} asset={asset} />
      ))}
    </div>,
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
