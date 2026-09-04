/**
 * LedgerHeader — R4a sticky evidence pane chrome.
 * Why: counts, filter, and stepper stay visible while scrolling findings (09 R4a).
 */

import { ChevronLeft, ChevronRight } from "lucide-react";
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
        "cursor-pointer pb-1.5 font-sans text-xs",
        active
          ? "border-b-2 border-fg pb-[5px] font-semibold text-fg"
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
    <div className="flex shrink-0 flex-col gap-1 border-b border-hairline bg-ground px-5 py-3.5">
      <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-fg-muted">
        Evidence &amp; decisions
      </p>
      <p className="font-sans text-sm font-semibold tracking-tight text-fg">
        {countLine}
      </p>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-hairline/80 pb-1.5">
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
    </div>
  );
}
