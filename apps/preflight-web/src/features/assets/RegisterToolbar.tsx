/**
 * RegisterToolbar — filter tabs plus client-side query controls on Screen 2.
 * Why: search, campaign, status, and sort live on the register rail, not header.
 */
// size: three selects + tabs share one toolbar strip

import type { ReactElement, ReactNode } from "react";
import { ArrowDownUp, ListFilter } from "lucide-react";

import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RegisterFilter } from "@/features/assets/register-lib";
import type {
  RegisterQuery,
  RegisterSort,
  RegisterStatusFilter,
} from "@/features/assets/register-query";
import { cn } from "@/lib/utils";

const FILTER_TABS: { id: RegisterFilter; label: string }[] = [
  { id: "needs_you", label: "Needs you" },
  { id: "all", label: "All" },
  { id: "resolved", label: "Resolved" },
];

const STATUS_OPTIONS: { value: RegisterStatusFilter; label: string }[] = [
  { value: "any", label: "Any status" },
  { value: "blocked", label: "Blocked" },
  { value: "needs_human", label: "Review" },
  { value: "needs_regen", label: "Regen" },
  { value: "cleared_with_exception", label: "Exception" },
  { value: "clear", label: "Clear" },
];

const SORT_OPTIONS: { value: RegisterSort; label: string }[] = [
  { value: "urgent", label: "Most urgent" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

function RegisterFilterTabs({
  filter,
  onFilterChange,
  counts,
}: {
  filter: RegisterFilter;
  onFilterChange: (next: RegisterFilter) => void;
  counts?: { needYou: number; all: number; resolved: number };
}): ReactElement {
  return (
    <div className="flex flex-wrap gap-6">
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
                  active ? "font-medium text-primary" : "text-fg-muted",
                )}
              >
                [{count}]
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function ToolbarSelect({
  value,
  onValueChange,
  icon,
  ariaLabel,
  children,
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  icon: ReactElement;
  ariaLabel: string;
  children: ReactNode;
  className?: string;
}): ReactElement {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next !== null) {
          onValueChange(next);
        }
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label={ariaLabel}
        className={cn("min-w-[9.5rem]", className)}
      >
        <span className="inline-flex items-center gap-1.5 text-fg-muted" aria-hidden>
          {icon}
        </span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

export function RegisterToolbar({
  filter,
  onFilterChange,
  counts,
  query,
  campaignOptions,
  onSearchChange,
  onCampaignChange,
  onStatusChange,
  onSortChange,
}: {
  filter: RegisterFilter;
  onFilterChange: (next: RegisterFilter) => void;
  counts?: { needYou: number; all: number; resolved: number };
  query: RegisterQuery;
  campaignOptions: string[];
  onSearchChange: (value: string) => void;
  onCampaignChange: (value: string | "all") => void;
  onStatusChange: (value: RegisterStatusFilter) => void;
  onSortChange: (value: RegisterSort) => void;
}): ReactElement {
  return (
    <div className="my-4 border-b border-[var(--color-chrome-bottom)]/15 pb-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <RegisterFilterTabs
          filter={filter}
          onFilterChange={onFilterChange}
          counts={counts}
        />
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={query.search}
            onValueChange={onSearchChange}
            placeholder="Search assets…"
            className="w-full sm:w-auto"
          />
          <ToolbarSelect
            value={query.campaign}
            onValueChange={onCampaignChange}
            icon={<ListFilter className="size-3.5 shrink-0" />}
            ariaLabel="Filter by campaign"
          >
            <SelectItem value="all">All campaigns</SelectItem>
            {campaignOptions.map((campaign) => (
              <SelectItem key={campaign} value={campaign}>
                {campaign}
              </SelectItem>
            ))}
          </ToolbarSelect>
          <ToolbarSelect
            value={query.status}
            onValueChange={(value) => onStatusChange(value as RegisterStatusFilter)}
            icon={<ListFilter className="size-3.5 shrink-0" />}
            ariaLabel="Filter by status"
          >
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </ToolbarSelect>
          <ToolbarSelect
            value={query.sort}
            onValueChange={(value) => onSortChange(value as RegisterSort)}
            icon={<ArrowDownUp className="size-3.5 shrink-0" />}
            ariaLabel="Sort assets"
          >
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </ToolbarSelect>
        </div>
      </div>
    </div>
  );
}
