/**
 * AssetsListShell — Screen 2 register column, header, and toolbar rail.
 * Why: paper-ground register per 09 R1; no PageStage card (08 §4.4).
 */

import { Plus } from "lucide-react";
import type { ReactElement } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { PrimaryButton } from "@/components/ui/primary-button";
import type { AssetsListShellProps } from "@/features/assets/types";

export function AssetsListShell({
  children,
  createInFlight,
  onNewCampaign,
  workSummary,
  showFilter,
  toolbar,
}: AssetsListShellProps): ReactElement {
  const handleNewCampaign = (): void => {
    void onNewCampaign();
  };

  return (
    <div className="flex min-h-below-topbar flex-col bg-ground px-8 pt-8 pb-16">
      <div className="mx-auto flex w-full max-w-register flex-1 flex-col">
        <PageHeader
          eyebrow="ASSET REGISTER"
          title="Your review queue"
          supportingLine={workSummary}
          action={
            <PrimaryButton
              loading={createInFlight}
              icon={<Plus className="size-4 shrink-0" aria-hidden="true" />}
              onClick={handleNewCampaign}
            >
              New campaign
            </PrimaryButton>
          }
        />

        {showFilter ? toolbar : null}

        <div className="mt-8 flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
