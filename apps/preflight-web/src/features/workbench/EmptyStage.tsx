/**
 * EmptyStage — welcome centered; composer docked at stage bottom.
 * Why: logo + dotted prompts in middle; input + campaign handoff below (09 R2a).
 */

import type { ReactElement, ReactNode } from "react";

import { WORKBENCH_INVITATION, WORKBENCH_PROMPT_CHIPS } from "@/features/workbench/lib";
import { CampaignHandoffLink } from "@/features/workbench/CampaignHandoffLink";
import { WorkbenchLogoMark } from "@/features/workbench/WorkbenchLogoMark";

export interface EmptyStageProps {
  composer: ReactNode;
  onPromptSelect: (text: string) => void;
  onGoToCampaign?: () => void;
  handoffInFlight?: boolean;
}

function PromptSuggestion({
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
      className="max-w-lg cursor-pointer text-center text-body-airy text-fg-muted underline decoration-primary/50 decoration-dotted underline-offset-4 transition-colors hover:text-primary hover:decoration-primary disabled:pointer-events-none disabled:opacity-50"
    >
      {text}
    </button>
  );
}

export function EmptyStage({
  composer,
  onPromptSelect,
  onGoToCampaign,
  handoffInFlight = false,
}: EmptyStageProps): ReactElement {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8 sm:px-10">
        <WorkbenchLogoMark />
        <p className="max-w-md text-center text-body-airy text-fg-muted">
          {WORKBENCH_INVITATION}
        </p>
        <div className="flex flex-col items-center gap-3">
          {WORKBENCH_PROMPT_CHIPS.map((chip) => (
            <PromptSuggestion
              key={chip}
              text={chip}
              disabled={handoffInFlight}
              onSelect={() => onPromptSelect(chip)}
            />
          ))}
        </div>
      </div>
      <div className="shrink-0 border-t border-border p-4 sm:px-6">
        {composer}
        {onGoToCampaign !== undefined ? (
          <div className="mt-2 flex justify-end">
            <CampaignHandoffLink
              onClick={onGoToCampaign}
              disabled={handoffInFlight}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
