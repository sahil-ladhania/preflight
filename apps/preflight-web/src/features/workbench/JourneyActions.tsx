/**
 * JourneyActions — explicit Save, Freeze, Generate in the thread.
 * Why: explainer proposes only; operator clicks existing campaign HTTP.
 */

import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { JourneyActionsProps } from "@/features/workbench/types";

export function JourneyActions({
  active,
  saveDisabled,
  saveCaption,
  freezeDisabled,
  freezeCaption,
  generateDisabled,
  generateCaption,
  emptySetVisible,
  emptySetAcknowledged,
  saveInFlight,
  freezeInFlight,
  generateInFlight,
  onSave,
  onFreeze,
  onGenerate,
  onEmptySetAckChange,
}: JourneyActionsProps): ReactElement | null {
  if (!active) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-canvas px-4 py-3">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex flex-col items-start gap-1">
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-md px-4"
            disabled={saveDisabled || saveInFlight}
            onClick={onSave}
          >
            {saveInFlight ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              "Save brief"
            )}
          </Button>
          {saveCaption !== null ? (
            <span className="text-caption text-fg-muted">{saveCaption}</span>
          ) : null}
        </div>
        <div className="flex flex-col items-start gap-1">
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-md px-4"
            disabled={freezeDisabled || freezeInFlight}
            onClick={onFreeze}
          >
            {freezeInFlight ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              "Freeze"
            )}
          </Button>
          {freezeCaption !== null ? (
            <span className="text-caption text-fg-muted">{freezeCaption}</span>
          ) : null}
        </div>
        <div className="flex flex-col items-start gap-1">
          <Button
            type="button"
            className="h-8 rounded-md px-4"
            disabled={generateDisabled || generateInFlight}
            onClick={onGenerate}
          >
            {generateInFlight ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              "Generate"
            )}
          </Button>
          {generateCaption !== null ? (
            <span className="text-caption text-fg-muted">{generateCaption}</span>
          ) : null}
        </div>
      </div>
      {emptySetVisible ? (
        <label className="flex cursor-pointer items-center gap-2 text-body text-fg">
          <Checkbox
            checked={emptySetAcknowledged}
            onCheckedChange={(checked) => onEmptySetAckChange(checked === true)}
          />
          I intend an empty constraint set
        </label>
      ) : null}
    </div>
  );
}
