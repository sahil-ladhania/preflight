/**
 * Composer — R3 textarea and Send control.
 * Why: Enter sends; Shift+Enter newline; sticky footer row.
 */

import type { KeyboardEvent, ReactElement } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ComposerProps } from "@/features/workbench/types";

export function Composer({
  value,
  disabled,
  sendInFlight,
  onChange,
  onSend,
  onGoToCampaign,
}: ComposerProps): ReactElement {
  const canSend = value.trim().length > 0 && !sendInFlight && !disabled;

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
      <Textarea
        value={value}
        disabled={disabled || sendInFlight}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about rules, constraints, or compliance…"
        className="min-h-20 max-h-40 text-body-airy"
      />
      <div className="flex items-center justify-between gap-2">
        {onGoToCampaign !== undefined ? (
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-md px-4"
            onClick={onGoToCampaign}
          >
            Go to Campaign
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="button"
          className="h-8 rounded-md px-4"
          disabled={!canSend}
          onClick={onSend}
        >
          {sendInFlight ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            "Send"
          )}
        </Button>
      </div>
    </div>
  );
}
