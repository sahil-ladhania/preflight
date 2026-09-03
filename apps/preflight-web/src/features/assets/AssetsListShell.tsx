/**
 * AssetsListShell — Screen 2 register column, header, and page end-line.
 * Why: paper-ground register per 09 R1; no PageStage card (08 §4.4).
 */

import { Loader2 } from "lucide-react";
import type { ReactElement } from "react";

import type { RegisterFilter } from "@/features/assets/register-lib";
import type { AssetsListShellProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

const FILTER_TABS: { id: RegisterFilter; label: string }[] = [
  { id: "needs_you", label: "Needs you" },
  { id: "all", label: "All" },
  { id: "resolved", label: "Resolved" },
];

function RegisterFilterRail({
  filter,
  onFilterChange,
}: {
  filter: RegisterFilter;
  onFilterChange: (next: RegisterFilter) => void;
}): ReactElement {
  return (
    <div className="mt-5 border-b border-hairline">
      <div className="flex gap-6">
        {FILTER_TABS.map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={cn(
                "cursor-pointer border-0 bg-transparent pb-2 text-[11px] leading-[1.4]",
                active
                  ? "border-b-2 border-fg pb-[9px] font-semibold text-fg"
                  : "text-fg-muted",
              )}
              onClick={() => onFilterChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AssetsListShell({
  children,
  createInFlight,
  onNewCampaign,
  workSummary,
  filter,
  onFilterChange,
  showFilter,
  endLine,
}: AssetsListShellProps): ReactElement {
  const handleNewCampaign = (): void => {
    void onNewCampaign();
  };

  return (
    <div className="flex min-h-below-topbar flex-col bg-ground px-12 pt-8 pb-12 lg:px-20 xl:px-32">
      <div className="mx-auto flex w-full max-w-register flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-serif text-page-title text-fg">Asset Register</h1>
            {workSummary !== null ? (
              <p className="text-ui text-fg-muted">{workSummary}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="inline-flex h-8 shrink-0 cursor-pointer items-center justify-center border border-fg bg-ground px-4 font-sans text-button font-medium text-fg hover:bg-fg hover:text-surface disabled:cursor-not-allowed disabled:opacity-50"
            disabled={createInFlight}
            onClick={handleNewCampaign}
          >
            {createInFlight ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              "+ New campaign"
            )}
          </button>
        </div>

        {showFilter ? (
          <RegisterFilterRail filter={filter} onFilterChange={onFilterChange} />
        ) : null}

        <div className="mt-6 flex flex-1 flex-col">{children}</div>

        {endLine !== null ? (
          <div className="mt-auto pt-8">
            <div className="border-t border-fg pt-3">
              <p className="text-label-strong uppercase text-fg-muted">
                {endLine}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
