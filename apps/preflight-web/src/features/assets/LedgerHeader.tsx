/**
 * LedgerHeader — R4a sticky evidence pane chrome.
 * Why: counts, filter, and stepper stay visible while scrolling findings (09 R4a).
 */

import { ChevronLeft, ChevronRight, ListChecks } from "lucide-react";
import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import type { LedgerHeaderProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}): ReactElement {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer pb-2 font-sans text-xs",
        active
          ? "-mb-px border-b-2 border-fg font-semibold text-fg"
          : "text-fg-muted hover:text-fg",
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function LedgerHeader({
  countLine,
  filter,
  onFilterChange,
  stepperText,
  showStepperChevrons,
  canStepperPrev,
  canStepperNext,
  onStepperPrev,
  onStepperNext,
}: LedgerHeaderProps): ReactElement {
  return (
    <div className="flex shrink-0 flex-col bg-surface px-5 pt-4 pb-1.5">
      {/* Column 3 Horizon Header: Label left, stepper right */}
      <div className="flex h-7 shrink-0 items-center justify-between">
        <p className="inline-flex items-center gap-1.5 font-sans text-label-strong uppercase tracking-[0.06em] text-fg-muted">
          <ListChecks className="size-3.5 shrink-0" aria-hidden />
          Evidence &amp; decisions
        </p>
        {stepperText ? (
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-fg-muted">
            {showStepperChevrons ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-5 rounded-none p-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-hover hover:text-fg"
                disabled={!canStepperPrev}
                onClick={onStepperPrev}
                aria-label="Previous open finding"
              >
                <ChevronLeft className="size-3.5" aria-hidden />
              </Button>
            ) : null}
            <span className="font-sans text-xs">{stepperText}</span>
            {showStepperChevrons ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-5 rounded-none p-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:bg-hover hover:text-fg"
                disabled={!canStepperNext}
                onClick={onStepperNext}
                aria-label="Next open finding"
              >
                <ChevronRight className="size-3.5" aria-hidden />
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Count Line and Filter Tabs Rail */}
      <div className="mt-3 flex flex-col gap-2">
        <p className="font-serif text-lg font-semibold tracking-tight text-fg">
          {countLine}
        </p>
        <div className="flex gap-5 border-b border-hairline">
          <FilterTab
            label="All"
            active={filter === "all"}
            onClick={() => onFilterChange("all")}
          />
          <FilterTab
            label="Open only"
            active={filter === "open"}
            onClick={() => onFilterChange("open")}
          />
        </div>
      </div>
    </div>
  );
}
