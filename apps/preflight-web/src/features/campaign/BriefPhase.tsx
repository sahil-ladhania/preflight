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
  ...formProps
}: BriefPhaseProps): ReactElement {
  const [editing, setEditing] = useState<boolean>(!briefSaved);
  const [manualOpen, setManualOpen] = useState<boolean>(false);

  const hasContent = briefHasDraftContent(freeText, brief);
  const showBuildPanel =
    onRunBuild !== undefined &&
    (hasContent || briefSaved || buildPhase !== "idle");
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

  return (
    <div className="flex flex-col gap-4">
      {showBuildPanel ? (
        <BuildPanel
          buildPhase={buildPhase}
          buildInFlight={buildInFlight}
          missingFields={missingFieldsBuild}
          canBuild={hasContent || briefSaved}
          emptySetAcknowledged={emptySetAcknowledged}
          onRunBuild={onRunBuild}
          onEmptySetAckChange={onEmptySetAckChange ?? (() => undefined)}
        />
      ) : null}
      <BriefForm
        {...formProps}
        freeText={freeText}
        brief={brief}
        missingFields={highlightMissing}
        showStructuredForm={showStructuredForm}
        showManualActions={manualOpen || briefSaved}
      />
      {!showStructuredForm ? (
        <button
          type="button"
          className="w-fit cursor-pointer text-caption text-primary underline underline-offset-4"
          onClick={() => setManualOpen(true)}
        >
          Edit fields manually
        </button>
      ) : null}
    </div>
  );
}
