/**
 * BriefPhase — S1 brief pane and S2 building state.
 * Why: one textarea, Build it, Try an example, and field review disclosure.
 */

import { useEffect, useState, type ReactElement } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BuildPanel } from "@/features/campaign/BuildPanel";
import { FieldReview } from "@/features/campaign/FieldReview";
import {
  briefHasDraftContent,
  CAMPAIGN_TEXTAREA_CLASS,
} from "@/features/campaign/lib";
import type { BriefPhaseProps } from "@/features/campaign/types";
import { EXAMPLE_BRIEF_FREE_TEXT } from "@/fixtures/campaign";
import { cn } from "@/lib/utils";

export function BriefPhase({
  building,
  buildPhase = "idle",
  buildInFlight = false,
  missingFieldsBuild = [],
  emptySetAcknowledged = false,
  onRunBuild,
  onEmptySetAckChange,
  missingFields = [],
  freeText,
  brief,
  onFreeTextChange,
  onBriefChange,
  onFieldEdit,
}: BriefPhaseProps): ReactElement {
  const [fieldsOpen, setFieldsOpen] = useState<boolean>(false);

  const hasContent = briefHasDraftContent(freeText, brief);
  const highlightMissing =
    buildPhase === "needs_input" ? missingFieldsBuild : missingFields;
  const fieldsEditable =
    buildPhase === "needs_input" || fieldsOpen || highlightMissing.length > 0;

  useEffect(() => {
    if (buildPhase === "needs_input") {
      setFieldsOpen(true);
    }
  }, [buildPhase]);

  const handleTryExample = (): void => {
    onFreeTextChange(EXAMPLE_BRIEF_FREE_TEXT);
  };

  return (
    <div className="flex flex-col gap-5">
      <Card className="rounded-none border border-border bg-surface shadow-none">
        <CardHeader className="border-b border-border/80 px-5 py-3.5">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-sm font-semibold tracking-tight text-fg">
              Campaign Brief
            </CardTitle>
            <span className="font-mono text-[11px] text-fg-muted">
              {freeText.trim().length > 0
                ? `${freeText.trim().length} chars`
                : "Draft"}
            </span>
          </div>
          <CardDescription className="font-sans text-xs text-fg-muted">
            Describe your campaign in plain language. Preflight compiles
            applicable rules and extracts structured brief fields.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-5">
          <textarea
            value={freeText}
            disabled={building}
            placeholder="Describe your campaign in plain language…"
            onChange={(event) => onFreeTextChange(event.target.value)}
            className={cn(
              CAMPAIGN_TEXTAREA_CLASS,
              "border-border bg-ground/40 transition-colors focus-visible:border-decision focus-visible:bg-surface",
              building && "pointer-events-none opacity-40",
            )}
          />
          {onRunBuild !== undefined ? (
            <BuildPanel
              buildPhase={buildPhase}
              buildInFlight={buildInFlight}
              canBuild={hasContent}
              emptySetAcknowledged={emptySetAcknowledged}
              onRunBuild={onRunBuild}
              onEmptySetAckChange={onEmptySetAckChange ?? (() => undefined)}
              onTryExample={building ? undefined : handleTryExample}
            />
          ) : null}
        </CardContent>
      </Card>

      <FieldReview
        brief={brief}
        open={fieldsOpen}
        editable={fieldsEditable && !building}
        missingFields={highlightMissing}
        onToggle={() => setFieldsOpen((open) => !open)}
        onBriefChange={onBriefChange}
        onFieldEdit={onFieldEdit}
      />
    </div>
  );
}
