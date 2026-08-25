/**
 * AssetsList — Screen 2 list page body.
 * Why: assets ledger entry list.
 */

import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { CAMPAIGN_ID_FRESH } from "@/fixtures/campaign";
import { AssetListRow } from "@/features/assets/AssetListRow";
import type { AssetsListProps } from "@/features/assets/types";
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

function NewCampaignButton(): ReactElement {
  const navigate = useNavigate();

  const handleClick = (): void => {
    // Will POST /campaigns and navigate to /campaign/:id.
    void navigate(`/campaign/${CAMPAIGN_ID_FRESH}`);
  };

  return (
    <Button type="button" className="h-8 rounded-md px-4" onClick={handleClick}>
      New campaign
    </Button>
  );
}

function PageHeader(): ReactElement {
  return (
    <div className="flex items-center justify-between border-b border-border bg-canvas px-4 py-3">
      <h1 className="text-title text-fg">Assets</h1>
      <NewCampaignButton />
    </div>
  );
}

function EmptyState(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <p className="text-caption text-fg-muted">No assets yet</p>
      <NewCampaignButton />
    </div>
  );
}

function LoadingState(): ReactElement {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">
      <div
        className="size-4 animate-spin rounded-full border-2 border-fg border-t-transparent"
        aria-label="Loading"
      />
    </div>
  );
}

function ErrorState(): ReactElement {
  const handleRetry = (): void => {
    // Will re-GET /assets.
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
}: AssetsListProps): ReactElement {
  if (view === "loading") {
    return <LoadingState />;
  }

  if (view === "error") {
    return <ErrorState />;
  }

  if (assets.length === 0) {
    return (
      <div className="bg-canvas">
        <PageHeader />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="bg-canvas-subtle">
      <PageHeader />
      <div className="bg-canvas">
        <ListHeaderRow />
        {assets.map((asset) => (
          <AssetListRow key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
}
