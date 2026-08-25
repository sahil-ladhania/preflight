/**
 * BriefDocument — read-only campaign brief after Save.
 * Why: doc 19 G7 brief as documentation layout.
 */

import type { ReactElement } from "react";

import type { StructuredBriefInput } from "@preflight/schemas";

import { BRIEF_SCALAR_FIELDS } from "@/features/campaign/lib";
import { Button } from "@/components/ui/button";

export interface BriefDocumentProps {
  brief: StructuredBriefInput;
  onEdit: () => void;
}

function DocumentField({
  label,
  value,
}: {
  label: string;
  value: string;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-caption text-fg-muted">{label}</p>
      <p className="text-body-airy text-fg">{value.length > 0 ? value : "—"}</p>
    </div>
  );
}

function formatChannels(channels: StructuredBriefInput["channels"]): string {
  if (channels.length === 0) {
    return "—";
  }
  return channels.join(", ");
}

function formatFigures(
  figures: StructuredBriefInput["performanceFigures"],
): string {
  if (figures.length === 0) {
    return "None";
  }
  return figures
    .map((figure) =>
      figure.period.length > 0
        ? `${figure.value} (${figure.period})`
        : figure.value,
    )
    .join("; ");
}

function formatClaims(claims: StructuredBriefInput["claims"]): string {
  if (claims.length === 0) {
    return "None";
  }
  return claims.join("; ");
}

export function BriefDocument({
  brief,
  onEdit,
}: BriefDocumentProps): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-caption text-fg-muted">Campaign brief</p>
        <Button
          type="button"
          variant="outline"
          className="h-8 rounded-md px-4"
          onClick={onEdit}
        >
          Edit brief
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {BRIEF_SCALAR_FIELDS.map(({ key, label }) => (
          <DocumentField
            key={key}
            label={label}
            value={brief[key] as string}
          />
        ))}
        <DocumentField label="Channels" value={formatChannels(brief.channels)} />
        <DocumentField
          label="Performance figures"
          value={formatFigures(brief.performanceFigures)}
        />
        <DocumentField label="Claims" value={formatClaims(brief.claims)} />
      </div>
    </div>
  );
}
