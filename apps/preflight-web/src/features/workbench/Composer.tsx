/**
 * Composer — in-field send icon + optional campaign handoff row.
 * Why: stage-docked input; Enter sends, Shift+Enter newline.
 */

import type { KeyboardEvent, ReactElement } from "react";
import { Loader2, SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CampaignHandoffLink } from "@/features/workbench/CampaignHandoffLink";
import type { ComposerProps } from "@/features/workbench/types";
import { cn } from "@/lib/utils";

export function Composer({
  value,
  disabled = false,
  sendInFlight,
  handoffInFlight = false,
  handoffEnabled = false,
  showCampaignActions = false,
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

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSend) {
        onSend();
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Textarea
          value={value}
          disabled={inputDisabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a campaign or ask about rules and compliance…"
          className="min-h-16 max-h-28 resize-none rounded-xl border-transparent bg-canvas-subtle/50 py-3 pr-12 pl-4 text-body-airy shadow-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
        />
        <button
          type="button"
          aria-label="Send message"
          disabled={!canSend}
          onClick={onSend}
          className={cn(
            "absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-md transition-colors",
            canSend
              ? "cursor-pointer text-primary hover:bg-primary/10"
              : "cursor-not-allowed text-fg-muted opacity-40",
          )}
        >
          {sendInFlight ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <SendHorizontal className="size-4" aria-hidden />
          )}
        </button>
      </div>
      {showCampaignActions ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {onStartCampaignFromConversation !== undefined && handoffEnabled ? (
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-md px-4"
                disabled={!canHandoff}
                onClick={onStartCampaignFromConversation}
              >
                {handoffInFlight ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  "Start campaign from this conversation"
                )}
              </Button>
            ) : null}
          </div>
          {onGoToCampaign !== undefined ? (
            <CampaignHandoffLink
              onClick={onGoToCampaign}
              disabled={handoffInFlight}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
