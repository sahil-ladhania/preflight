/**
 * EmptyStage — Workbench empty column on ground, no stage chrome.
 * Why: optically centred 820px block; persona orders the two prompt groups.
 */

import type { ReactElement, ReactNode } from "react";

import { usePersona } from "@/features/shell/PersonaProvider";
import {
  promptGroupsForPersona,
  WORKBENCH_HEADLINE,
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
      className="group flex items-start gap-2.5 cursor-pointer border-0 p-0 bg-transparent text-left text-ui leading-[18px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-decision disabled:pointer-events-none disabled:opacity-50"
    >
      <span
        className="select-none text-fg-muted text-xs leading-[18px] group-hover:text-decision"
        aria-hidden="true"
      >
        •
      </span>
      <span className="text-decision underline decoration-dotted underline-offset-4 group-hover:decoration-solid">
        {text}
      </span>
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
    <div className="mx-auto flex h-full min-h-below-topbar w-full max-w-workbench flex-col justify-center px-8">
      <div className="-translate-y-[6vh] flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-page-title text-fg font-semibold tracking-tight">
            {WORKBENCH_HEADLINE}
          </h1>
        </div>
        {composer}
        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <div key={group.label} className="flex flex-col gap-2">
              <span className="text-label-strong uppercase text-fg-muted">
                {group.label}
              </span>
              <div className="flex flex-col items-start gap-2">
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
