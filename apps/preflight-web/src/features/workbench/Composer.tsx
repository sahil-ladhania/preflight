/**
 * Composer — empty Ask → bar or thread send icon + handoff row.
 * Why: 08 §5.16 empty box; Enter sends, Shift+Enter newline.
 */

import type { KeyboardEvent, ReactElement } from "react";
import { Loader2 } from "lucide-react";

import { CampaignHandoffLink } from "@/features/workbench/CampaignHandoffLink";
import { WORKBENCH_COMPOSER_PLACEHOLDER } from "@/features/workbench/lib";
import type { ComposerProps } from "@/features/workbench/types";
import { cn } from "@/lib/utils";

export function Composer({
  value,
  disabled = false,
  sendInFlight,
  handoffInFlight = false,
  handoffEnabled = false,
  handoffDisabledCaption = null,
  showCampaignActions = false,
  appearance: _appearance = "thread",
  onChange,
  onSend,
  onGoToCampaign,
  onStartCampaignFromConversation,
}: ComposerProps): ReactElement {
  const canSend = value.trim().length > 0 && !sendInFlight && !disabled;
  const canHandoff =
    handoffEnabled &&
    !handoffInFlight &&
    !sendInFlight &&
    !disabled &&
    onStartCampaignFromConversation !== undefined;
  const inputDisabled = disabled || sendInFlight || handoffInFlight;
  const showHandoffButton = onStartCampaignFromConversation !== undefined;

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSend) {
        onSend();
      }
    }
  };

  const campaignActions =
    showCampaignActions ? (
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          {showHandoffButton ? (
            <button
              type="button"
              disabled={!canHandoff}
              onClick={onStartCampaignFromConversation}
              className="cursor-pointer font-sans text-ui-strong font-semibold text-decision hover:underline disabled:pointer-events-none disabled:opacity-50"
            >
              {handoffInFlight ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                  Starting…
                </span>
              ) : (
                "Start campaign from this conversation →"
              )}
            </button>
          ) : null}
          {showHandoffButton && !canHandoff && handoffDisabledCaption !== null ? (
            <span className="text-caption text-fg-muted">
              {handoffDisabledCaption}
            </span>
          ) : null}
        </div>
        {onGoToCampaign !== undefined ? (
          <CampaignHandoffLink
            onClick={onGoToCampaign}
            disabled={handoffInFlight}
          />
        ) : null}
      </div>
    ) : null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative flex min-h-[96px] max-h-[200px] flex-col justify-between rounded-none border border-fg bg-ground p-3.5 focus-within:border-decision">
        <textarea
          value={value}
          disabled={inputDisabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={WORKBENCH_COMPOSER_PLACEHOLDER}
          className="w-full flex-1 resize-none border-0 bg-transparent p-0 font-serif text-copy text-fg shadow-none outline-none placeholder:text-fg-faint focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            aria-label="Send message"
            disabled={!canSend}
            onClick={onSend}
            className={cn(
              "shrink-0 border-0 bg-transparent p-0 font-sans text-ui-strong font-semibold text-decision",
              canSend
                ? "cursor-pointer hover:text-decision/80"
                : "cursor-not-allowed opacity-40",
            )}
          >
            {sendInFlight ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              "Ask →"
            )}
          </button>
        </div>
      </div>
      {campaignActions}
    </div>
  );
}
