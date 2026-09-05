/**
 * AssetsListShell — Screen 2 register column, header, and page end-line.
 * Why: paper-ground register per 09 R1; no PageStage card (08 §4.4).
 */

import { Plus } from "lucide-react";
import type { ReactElement } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { PrimaryButton } from "@/components/ui/primary-button";
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
    <div className="my-6 border-b border-[var(--color-chrome-bottom)]/15 py-3">
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
                "flex cursor-pointer items-center gap-2 border-0 bg-transparent pb-1 text-xs transition-colors",
                active
                  ? "border-b-2 border-primary pb-[3px] font-semibold text-primary"
                  : "text-fg-muted hover:text-fg",
              )}
              onClick={() => onFilterChange(tab.id)}
            >
              <span>{tab.label}</span>
              {count !== undefined ? (
                <span
                  className={cn(
                    "font-mono text-[11px] transition-colors",
                    active
                      ? "text-primary font-medium"
                      : "text-fg-muted",
                  )}
                >
                  [{count}]
                </span>
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
  search,
  filter,
  onFilterChange,
  showFilter,
  endLine,
  counts,
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
          search={search}
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

        {showFilter ? (
          <RegisterFilterRail
            filter={filter}
            onFilterChange={onFilterChange}
            counts={counts}
          />
        ) : null}

        <div className="mt-6 flex flex-1 flex-col">
          {children}
          {endLine !== null ? (
            <footer className="mt-auto border-t border-fg pt-8">
              <p className="pt-3 font-sans text-label-strong uppercase tracking-[0.06em] text-fg-muted">
                {endLine}
              </p>
            </footer>
          ) : null}
        </div>
      </div>
    </div>
  );
}
