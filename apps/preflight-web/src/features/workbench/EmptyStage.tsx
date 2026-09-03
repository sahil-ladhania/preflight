/**
 * EmptyStage — Workbench empty column on ground, no stage chrome.
 * Why: optically centred 820px block; persona orders the two prompt groups.
 */

import type { ReactElement, ReactNode } from "react";

import { usePersona } from "@/features/shell/PersonaProvider";
import {
  promptGroupsForPersona,
  WORKBENCH_HEADLINE,
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
      className="cursor-pointer rounded-none border border-fg bg-ground px-3.5 py-2 text-left text-ui leading-[18px] text-fg shadow-none hover:bg-hover focus-visible:outline focus-visible:outline-1 focus-visible:outline-decision disabled:pointer-events-none disabled:opacity-50"
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
  const { actor } = usePersona();
  const groups = promptGroupsForPersona(actor?.id ?? "arjun");

  return (
    <div className="mx-auto flex min-h-below-topbar w-full max-w-workbench flex-col justify-center px-8">
      <div className="-translate-y-[6vh] flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-subject-title text-fg">
            {WORKBENCH_HEADLINE}
          </h1>
          <p className="text-ui text-fg-muted">{WORKBENCH_SUBLINE}</p>
        </div>
        {composer}
        <div className="flex flex-col gap-5">
          {groups.map((group) => (
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
