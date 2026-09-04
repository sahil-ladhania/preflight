/**
 * AssetsListShell — Screen 2 register column, header, and page end-line.
 * Why: paper-ground register per 09 R1; no PageStage card (08 §4.4).
 */

import { Loader2 } from "lucide-react";
import type { ReactElement } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  counts,
}: {
  filter: RegisterFilter;
  onFilterChange: (next: RegisterFilter) => void;
  counts?: { needYou: number; all: number; resolved: number };
}): ReactElement {
  return (
    <div className="mt-5 border-b border-hairline">
      <div className="flex gap-6">
        {FILTER_TABS.map((tab) => {
          const active = filter === tab.id;
          const count = counts
            ? counts[
                tab.id === "needs_you"
                  ? "needYou"
                  : tab.id === "all"
                    ? "all"
                    : "resolved"
              ]
            : undefined;

          return (
            <button
              key={tab.id}
              type="button"
              className={cn(
                "flex cursor-pointer items-center gap-2 border-0 bg-transparent pb-2 text-xs transition-colors",
                active
                  ? "border-b-2 border-primary pb-[7px] font-semibold text-primary"
                  : "text-fg-muted hover:text-fg",
              )}
              onClick={() => onFilterChange(tab.id)}
            >
              <span>{tab.label}</span>
              {count !== undefined ? (
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-none px-1.5 py-0 font-mono text-[10px] font-normal transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground font-medium"
                      : "border-border text-fg-muted",
                  )}
                >
                  {count}
                </Badge>
              ) : null}
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
  counts,
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
          <Button
            type="button"
            disabled={createInFlight}
            className="h-8 rounded-none border border-primary bg-primary px-4 font-sans text-button font-medium text-primary-foreground shadow-none hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleNewCampaign}
          >
            {createInFlight ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              "+ New campaign"
            )}
          </Button>
        </div>

        {showFilter ? (
          <RegisterFilterRail
            filter={filter}
            onFilterChange={onFilterChange}
            counts={counts}
          />
        ) : null}

        <div className="mt-6 flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
