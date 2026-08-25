/**
 * AssetsList — Screen 2 list page body.
 * Why: assets ledger entry list.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { AssetListRow } from "@/features/assets/AssetListRow";
import type { AssetsListProps } from "@/features/assets/types";
import { useAssetsList } from "@/features/assets/useAssetsList";
import { cn } from "@/lib/utils";

interface HeaderActionsProps {
  onNewCampaign?: () => void;
}

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

function NewCampaignButton({ onNewCampaign }: HeaderActionsProps): ReactElement {
  const handleClick = (): void => {
    onNewCampaign?.();
  };

  return (
    <Button type="button" className="h-8 rounded-md px-4" onClick={handleClick}>
      New campaign
    </Button>
  );
}

function PageHeader({ onNewCampaign }: HeaderActionsProps): ReactElement {
  return (
    <div className="flex items-center justify-between border-b border-border bg-canvas px-4 py-3">
      <h1 className="text-title text-fg">Assets</h1>
      <NewCampaignButton onNewCampaign={onNewCampaign} />
    </div>
  );
}

function EmptyState({ onNewCampaign }: HeaderActionsProps): ReactElement {
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <p className="text-caption text-fg-muted">No assets yet</p>
      <NewCampaignButton onNewCampaign={onNewCampaign} />
    </div>
  );
}

function LoadingState({
  showSpinner,
  onNewCampaign,
}: {
  showSpinner: boolean;
  onNewCampaign?: () => void;
}): ReactElement {
  if (!showSpinner) {
    return (
      <div className="bg-canvas">
        <PageHeader onNewCampaign={onNewCampaign} />
      </div>
    );
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

function ErrorState({ onRetry }: { onRetry?: () => void }): ReactElement {
  const handleRetry = (): void => {
    onRetry?.();
  };

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center gap-4">
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
  onNewCampaign,
  showLoadingSpinner = true,
}: AssetsListProps): ReactElement {
  if (view === "loading") {
    return (
      <LoadingState
        showSpinner={showLoadingSpinner}
        onNewCampaign={onNewCampaign}
      />
    );
  }

  if (view === "error") {
    return <ErrorState onRetry={onRetry} />;
  }

  if (assets.length === 0) {
    return (
      <div className="bg-canvas">
        <PageHeader onNewCampaign={onNewCampaign} />
        <EmptyState onNewCampaign={onNewCampaign} />
      </div>
    );
  }

  return (
    <div className="bg-canvas-subtle">
      <PageHeader onNewCampaign={onNewCampaign} />
      {pollError ? <PollErrorBanner onRetry={onRetry} /> : null}
      <div className="bg-canvas">
        <ListHeaderRow />
        {assets.map((asset) => (
          <AssetListRow key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
}

export function AssetsListRoute(): ReactElement {
  const { assets, view, pollError, showLoadingSpinner, retry, createCampaignAndGo } =
    useAssetsList();

  return (
    <AssetsList
      assets={assets}
      view={view}
      pollError={pollError}
      onRetry={retry}
      onNewCampaign={() => {
        void createCampaignAndGo();
      }}
      showLoadingSpinner={showLoadingSpinner}
    />
  );
}
