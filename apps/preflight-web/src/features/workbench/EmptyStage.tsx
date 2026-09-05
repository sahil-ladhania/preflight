/**
 * EmptyStage — Workbench empty column on ground, no stage chrome.
 * Why: optically centred 820px block; persona orders the two prompt groups.
 */

import type { ReactElement, ReactNode } from "react";
import { BookOpen, ClipboardList } from "lucide-react";

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

function PromptGroupIcon({ label }: { label: string }): ReactElement | null {
  if (label === "ASK ABOUT THE RULES") {
    return <BookOpen className="size-3.5 shrink-0" aria-hidden />;
  }
  if (label === "START A CAMPAIGN") {
    return <ClipboardList className="size-3.5 shrink-0" aria-hidden />;
  }
  return null;
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
      className="cursor-pointer rounded-none border border-fg bg-ground px-3.5 py-2 text-left font-sans text-ui leading-[18px] text-fg hover:bg-hover focus-visible:outline focus-visible:outline-1 focus-visible:outline-decision disabled:pointer-events-none disabled:opacity-50"
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
              <span className="inline-flex items-center gap-1.5 text-label-strong uppercase text-fg-muted">
                <PromptGroupIcon label={group.label} />
                {group.label}
              </span>
              <div className="flex flex-wrap items-start gap-2">
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
