/**
 * EmptyStage — Query the Rulebook welcome on ground, no stage chrome.
 * Why: left-aligned 820px column, grouped prompt pills (09 Screen 5).
 */

import type { ReactElement, ReactNode } from "react";

import {
  WORKBENCH_HEADLINE,
  WORKBENCH_PROMPT_GROUPS,
  WORKBENCH_SUBLINE,
} from "@/features/workbench/lib";

export interface EmptyStageProps {
  composer: ReactNode;
  onPromptSelect: (text: string) => void;
  handoffInFlight?: boolean;
}

function PromptPill({
  text,
  disabled,
  onSelect,
}: {
  text: string;
  disabled: boolean;
  onSelect: () => void;
}): ReactElement {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className="cursor-pointer border border-border bg-ground px-3.5 py-2 text-left text-caption text-fg hover:bg-hover disabled:pointer-events-none disabled:opacity-50"
    >
      {text}
    </button>
  );
}

export function EmptyStage({
  composer,
  onPromptSelect,
  handoffInFlight = false,
}: EmptyStageProps): ReactElement {
  return (
    <div className="flex h-below-topbar items-center justify-center">
      <div className="mx-auto flex w-full max-w-workbench flex-col gap-6 px-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-subject-title text-fg">
            {WORKBENCH_HEADLINE}
          </h1>
          <p className="text-caption text-fg-muted">{WORKBENCH_SUBLINE}</p>
        </div>
        {composer}
        <div className="flex flex-col gap-5">
          {WORKBENCH_PROMPT_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-2">
              <span className="text-label-strong uppercase text-fg-muted">
                {group.label}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.chips.map((chip) => (
                  <PromptPill
                    key={chip}
                    text={chip}
                    disabled={handoffInFlight}
                    onSelect={() => onPromptSelect(chip)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
