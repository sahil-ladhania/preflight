/**
 * LedgerHeader — R4a sticky evidence pane chrome.
 * Why: counts, filter, and stepper stay visible while scrolling findings (09 R4a).
 */

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactElement } from "react";

import type { LedgerHeaderProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

const headerLineClass = "font-sans text-count text-fg";

const filterTabClass =
  "cursor-pointer pb-1 font-sans text-[9px] leading-[1.4] font-normal tracking-normal";

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
        filterTabClass,
        active
          ? "border-b border-fg pb-[5px] font-medium text-fg"
          : "text-fg-muted",
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
    <div className="flex shrink-0 flex-col gap-1 border-b border-hairline bg-ground px-5 py-3">
      <p className="text-label-strong uppercase text-fg-muted">
        Evidence &amp; decisions
      </p>
      <p className={headerLineClass}>{countLine}</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-1.5">
        <div className="flex gap-5">
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
        <div className="flex items-center gap-1.5 font-sans text-[9px] leading-[1.4] font-normal tracking-normal text-fg-muted">
          {showStepperChevrons ? (
            <button
              type="button"
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canStepperPrev}
              onClick={onStepperPrev}
              aria-label="Previous open finding"
            >
              <ChevronLeft className="size-3" aria-hidden />
            </button>
          ) : null}
          <span>{stepperText}</span>
          {showStepperChevrons ? (
            <button
              type="button"
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canStepperNext}
              onClick={onStepperNext}
              aria-label="Next open finding"
            >
              <ChevronRight className="size-3" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
