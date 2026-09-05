/**
 * BriefPhase — S1 brief pane and S2 building state.
 * Why: one textarea, Build it, Try an example, and field review disclosure.
 */

import { useEffect, useState, type ReactElement } from "react";
import { ClipboardList } from "lucide-react";

import { BuildPanel } from "@/features/campaign/BuildPanel";
import { FieldReview } from "@/features/campaign/FieldReview";
import {
  briefHasDraftContent,
  CAMPAIGN_TEXTAREA_CLASS,
} from "@/features/campaign/lib";
import type { BriefPhaseProps } from "@/features/campaign/types";
import { OverviewSectionHeading } from "@/features/overview/OverviewSectionHeading";
import { EXAMPLE_BRIEF_FREE_TEXT } from "@/fixtures/campaign";
import { cn } from "@/lib/utils";

export function BriefPhase({
  building,
  documentState = "Draft",
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <OverviewSectionHeading
            title="Campaign Brief"
            icon={<ClipboardList className="size-4" />}
          />
          <span className="font-mono text-mono-faint uppercase text-fg-muted">
            {documentState}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <textarea
            value={freeText}
            disabled={building}
            placeholder="Describe your campaign in plain language…"
            onChange={(event) => onFreeTextChange(event.target.value)}
            className={cn(
              CAMPAIGN_TEXTAREA_CLASS,
              "border-hairline bg-surface font-serif text-copy transition-colors placeholder:font-sans placeholder:text-ui placeholder:text-fg-faint focus-visible:border-decision",
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
        </div>
      </div>

      <FieldReview
        brief={brief}
        open={fieldsOpen}
        editable={fieldsEditable && !building}
        missingFields={highlightMissing}
        onToggle={() => setFieldsOpen((open) => !open)}
        onBriefChange={onBriefChange}
        onFieldEdit={onFieldEdit}
      />
      {!building ? (
        <div className="border-t border-hairline pt-4">
          <p className="font-sans text-caption text-fg-muted">
            Build it structures your brief, freezes the rules that apply, then
            writes copy for each channel.
          </p>
        </div>
      ) : null}
    </div>
  );
}
