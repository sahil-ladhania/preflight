/**
 * BriefForm — R1 free-text and structured fields.
 * Why: proposed-field dashed borders from extract; missing-field highlight on stop.
 */

import { useEffect, type ReactElement } from "react";
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
import {
  BRIEF_FREE_TEXT_PLACEHOLDER,
  BRIEF_SCALAR_FIELDS,
  CAMPAIGN_INPUT_CLASS,
  CAMPAIGN_INPUT_FILLED_CLASS,
  CAMPAIGN_INPUT_MISSING_CLASS,
  CAMPAIGN_INPUT_PROPOSED_CLASS,
  CAMPAIGN_TEXTAREA_CLASS,
  INJECTION_BANNER_COPY,
} from "@/features/campaign/lib";
import type { BriefFormProps } from "@/features/campaign/types";
import { agentRunCaption } from "@/lib/agent-provenance";
import { cn } from "@/lib/utils";

function ScalarField({
  fieldKey,
  label,
  placeholder,
  value,
  proposed,
  missing,
  onChange,
}: {
  fieldKey: BriefField;
  label: string;
  placeholder: string;
  value: string;
  proposed: boolean;
  missing: boolean;
  onChange: (value: string) => void;
}): ReactElement {
  const filled = value.trim().length > 0;
  const inputClass = missing
    ? CAMPAIGN_INPUT_MISSING_CLASS
    : proposed
      ? CAMPAIGN_INPUT_PROPOSED_CLASS
      : filled
        ? CAMPAIGN_INPUT_FILLED_CLASS
        : CAMPAIGN_INPUT_CLASS;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldKey} className="text-caption text-fg-muted">
        {label}
        <span className="text-fail" aria-hidden="true">
          {" "}
          *
        </span>
      </label>
      <Input
        id={fieldKey}
        value={value}
        placeholder={placeholder}
        aria-required
        aria-invalid={missing}
        onChange={(event) => onChange(event.target.value)}
        className={cn(inputClass)}
      />
      {missing ? (
        <p className="text-caption text-fail">Required — still empty.</p>
      ) : null}
      {proposed && !missing ? (
        <p className="text-caption text-fg-muted">Proposed by extract</p>
      ) : null}
    </div>
  );
}

export function BriefForm({
  freeText,
  brief,
  proposedFieldKeys,
  extractSkillsRead,
  extractInjection,
  saveDisabled,
  saveDisabledCaption,
  saveInFlight,
  extractInFlight,
  missingFields = [],
  showFreeText = true,
  showStructuredForm = true,
  showManualActions = true,
  onFreeTextChange,
  onBriefChange,
  onFieldEdit,
  onExtract,
  onSave,
}: BriefFormProps): ReactElement {
  const missingSet = new Set(missingFields);
  const firstMissingKey = missingFields[0];

  useEffect(() => {
    if (missingFields.length === 0 || firstMissingKey === undefined) {
      return;
    }
    const element = document.getElementById(firstMissingKey);
    if (element instanceof HTMLInputElement) {
      element.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [missingFields, firstMissingKey]);

  const patchScalar = (key: BriefField, value: string): void => {
    onFieldEdit(key);
    onBriefChange({ ...brief, [key]: value });
  };

  return (
    <div className="flex flex-col gap-6">
      {showFreeText ? (
        <Textarea
          value={freeText}
          placeholder={BRIEF_FREE_TEXT_PLACEHOLDER}
          onChange={(event) => onFreeTextChange(event.target.value)}
          className={CAMPAIGN_TEXTAREA_CLASS}
        />
      ) : null}
      {showStructuredForm ? (
        <div className="flex flex-col gap-4 border-t border-border pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-caption text-fg-muted">Structured fields</p>
            {extractSkillsRead !== null ? (
              <p className="text-mono text-caption text-fg-muted">
                {agentRunCaption("extractor", extractSkillsRead)}
              </p>
            ) : null}
          </div>
          {extractInjection?.severity === "high" ? (
            <p className="text-caption text-fg-muted">{INJECTION_BANNER_COPY}</p>
          ) : null}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {BRIEF_SCALAR_FIELDS.map(({ key, label, placeholder }) => (
              <ScalarField
                key={key}
                fieldKey={key}
                label={label}
                placeholder={placeholder}
                value={brief[key] as string}
                proposed={proposedFieldKeys.has(key)}
                missing={missingSet.has(key)}
                onChange={(value) => patchScalar(key, value)}
              />
            ))}
            <ChannelsField
              channels={brief.channels}
              proposed={proposedFieldKeys.has("channels")}
              missing={missingSet.has("channels")}
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
          {showManualActions ? (
            <div className="flex flex-wrap items-center justify-end gap-3">
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
              <div className="flex flex-col items-end gap-1">
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
                {saveDisabledCaption !== null ? (
                  <span className="text-caption text-fg-muted">
                    {saveDisabledCaption}
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
