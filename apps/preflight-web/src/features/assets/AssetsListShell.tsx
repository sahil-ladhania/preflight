/**
 * AssetsListShell — outer heading + frosted stage for Screen 2 list.
 * Why: matches Workbench inset pattern; table lives inside the stage (09 R2).
 */

import { Loader2 } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { ASSETS_LIST_SUBTITLE } from "@/features/assets/lib";
import { PageStage } from "@/features/shell/PageStage";

export interface AssetsListShellProps {
  children: ReactNode;
  createInFlight: boolean;
  onNewCampaign: () => void;
}

export function AssetsListShell({
  children,
  createInFlight,
  onNewCampaign,
}: AssetsListShellProps): ReactElement {
  const handleNewCampaign = (): void => {
    void onNewCampaign();
  };

  return (
    <div className="min-h-below-topbar bg-ground p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-title text-fg">Assets</h1>
          <p className="text-caption text-fg-muted">{ASSETS_LIST_SUBTITLE}</p>
        </div>
        <Button
          type="button"
          className="h-8 shrink-0 rounded-md px-4"
          disabled={createInFlight}
          onClick={handleNewCampaign}
        >
          {createInFlight ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            "New campaign"
          )}
        </Button>
      </div>
      <PageStage fullHeight={false} className="mt-4 overflow-hidden">
        {children}
      </PageStage>
    </div>
  );
}
