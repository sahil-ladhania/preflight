/**
 * BriefPhase — progressive disclosure for brief entry and autonomous build.
 * Why: empty campaign shows describe-only; form and Build it unlock with content.
 */

import { useEffect, useState, type ReactElement } from "react";

import { BriefDocument } from "@/features/campaign/BriefDocument";
import { BriefForm } from "@/features/campaign/BriefForm";
import { BuildPanel } from "@/features/campaign/BuildPanel";
import { briefHasDraftContent } from "@/features/campaign/lib";
import type { BriefPhaseProps } from "@/features/campaign/types";

const EXAMPLE_BRIEF =
  "Bluepeak Flexi Cap — digital campaign for retail investors. Highlight flexibility and performance with professional tone.";

export function BriefPhase({
  briefSaved,
  briefDirty,
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
  ...formProps
}: BriefPhaseProps): ReactElement {
  const [editing, setEditing] = useState<boolean>(!briefSaved);
  const [manualOpen, setManualOpen] = useState<boolean>(false);

  const hasContent = briefHasDraftContent(freeText, brief);
  const showBuildPanel = onRunBuild !== undefined;
  const showStructuredForm =
    manualOpen || briefSaved || hasContent || buildPhase === "needs_input";
  const highlightMissing =
    buildPhase === "needs_input" ? missingFieldsBuild : missingFields;

  useEffect(() => {
    if (briefSaved && !briefDirty) {
      setEditing(false);
    }
  }, [briefSaved, briefDirty]);

  useEffect(() => {
    if (buildPhase === "needs_input") {
      setManualOpen(true);
    }
  }, [buildPhase]);

  const showDocument = briefSaved && !briefDirty && !editing;

  if (showDocument) {
    return (
      <BriefDocument brief={brief} onEdit={() => setEditing(true)} />
    );
  }

  const handleTryExample = (): void => {
    onFreeTextChange(EXAMPLE_BRIEF);
  };

  return (
    <div className="flex flex-col gap-4">
      <BriefForm
        {...formProps}
        freeText={freeText}
        brief={brief}
        missingFields={highlightMissing}
        showFreeText
        showStructuredForm={false}
        showManualActions={false}
        onFreeTextChange={onFreeTextChange}
      />
      {showBuildPanel ? (
        <BuildPanel
          buildPhase={buildPhase}
          buildInFlight={buildInFlight}
          missingFields={missingFieldsBuild}
          canBuild={hasContent || briefSaved}
          emptySetAcknowledged={emptySetAcknowledged}
          onRunBuild={onRunBuild}
          onEmptySetAckChange={onEmptySetAckChange ?? (() => undefined)}
          onTryExample={handleTryExample}
        />
      ) : null}
      <button
        type="button"
        className="w-fit cursor-pointer text-caption text-fg-muted underline underline-offset-4"
        onClick={() => setManualOpen((open) => !open)}
      >
        {manualOpen ? "▾" : "▸"} Review extracted fields
      </button>
      {showStructuredForm ? (
        <BriefForm
          {...formProps}
          freeText={freeText}
          brief={brief}
          missingFields={highlightMissing}
          showFreeText={false}
          showStructuredForm
          showManualActions={manualOpen || briefSaved}
          onFreeTextChange={onFreeTextChange}
        />
      ) : null}
    </div>
  );
}
