/**
 * BriefForm — R1 free-text and structured fields.
 * Why: proposed-field dashed borders from extract.
 */

import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";

import type { BriefField } from "@preflight/schemas";

import {
  ChannelsField,
  ClaimsField,
  PerformanceFiguresField,
} from "@/features/campaign/BriefArrayFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BRIEF_SCALAR_FIELDS } from "@/features/campaign/lib";
import type { BriefFormProps } from "@/features/campaign/types";
import { cn } from "@/lib/utils";

function ScalarField({
  fieldKey,
  label,
  value,
  proposed,
  onChange,
}: {
  fieldKey: BriefField;
  label: string;
  value: string;
  proposed: boolean;
  onChange: (value: string) => void;
}): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldKey} className="text-caption text-fg-muted">
        {label}
      </label>
      <Input
        id={fieldKey}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-auto px-4 py-3 text-body-airy",
          proposed && "border-dashed",
        )}
      />
      {proposed ? (
        <p className="text-caption text-fg-muted">Proposed by extract</p>
      ) : null}
    </div>
  );
}

export function BriefForm({
  freeText,
  brief,
  proposedFieldKeys,
  saveDisabled,
  saveInFlight,
  extractInFlight,
  onFreeTextChange,
  onBriefChange,
  onFieldEdit,
  onExtract,
  onSave,
}: BriefFormProps): ReactElement {
  const patchScalar = (key: BriefField, value: string): void => {
    onFieldEdit(key);
    onBriefChange({ ...brief, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <p className="text-caption text-fg-muted">Free-text brief</p>
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-md px-4"
            disabled={extractInFlight}
            onClick={onExtract}
          >
            {extractInFlight ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              "Extract"
            )}
          </Button>
        </div>
        <Textarea
          value={freeText}
          onChange={(event) => onFreeTextChange(event.target.value)}
          className="min-h-[120px] px-4 py-3 text-body-airy"
        />
      </div>
      <div className="flex flex-col gap-3">
        {BRIEF_SCALAR_FIELDS.map(({ key, label }) => (
          <ScalarField
            key={key}
            fieldKey={key}
            label={label}
            value={brief[key] as string}
            proposed={proposedFieldKeys.has(key)}
            onChange={(value) => patchScalar(key, value)}
          />
        ))}
        <ChannelsField
          channels={brief.channels}
          proposed={proposedFieldKeys.has("channels")}
          onChange={(channels) => {
            onFieldEdit("channels");
            onBriefChange({ ...brief, channels });
          }}
        />
        <PerformanceFiguresField
          figures={brief.performanceFigures}
          proposed={proposedFieldKeys.has("performanceFigures")}
          onChange={(figures) => {
            onFieldEdit("performanceFigures");
            onBriefChange({ ...brief, performanceFigures: figures });
          }}
        />
        <ClaimsField
          claims={brief.claims}
          proposed={proposedFieldKeys.has("claims")}
          onChange={(claims) => {
            onFieldEdit("claims");
            onBriefChange({ ...brief, claims });
          }}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-8 w-fit rounded-md px-4"
        disabled={saveDisabled || saveInFlight}
        onClick={onSave}
      >
        {saveInFlight ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          "Save brief"
        )}
      </Button>
    </div>
  );
}
