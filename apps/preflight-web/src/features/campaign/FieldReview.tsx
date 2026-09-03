/**
 * FieldReview — S1d collapsed eight-field review on a hairline rule.
 * Why: 09 Screen 3 prototype Label · value disclosure, not a full form grid.
 */

import type { ReactElement } from "react";

import type { BriefField, StructuredBriefInput } from "@preflight/schemas";

import {
  ChannelsField,
  ClaimsField,
  PerformanceFiguresField,
} from "@/features/campaign/BriefArrayFields";
import { fieldReviewRows } from "@/features/campaign/campaign-pane";
import {
  BRIEF_SCALAR_FIELDS,
  CAMPAIGN_INPUT_CLASS,
  CAMPAIGN_INPUT_MISSING_CLASS,
} from "@/features/campaign/lib";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface FieldReviewProps {
  brief: StructuredBriefInput;
  open: boolean;
  editable: boolean;
  missingFields: BriefField[];
  onToggle: () => void;
  onBriefChange: (brief: StructuredBriefInput) => void;
  onFieldEdit: (field: BriefField) => void;
}

function ReadOnlyRow({
  label,
  value,
  missing,
}: {
  label: string;
  value: string;
  missing: boolean;
}): ReactElement {
  return (
    <p
      className={cn(
        "font-serif text-copy text-fg",
        missing && "border-l-2 border-dashed border-hairline pl-3",
      )}
    >
      <span className="text-ui text-fg-muted">{label}</span>
      {" · "}
      {value.trim().length > 0 ? value : "—"}
    </p>
  );
}

export function FieldReview({
  brief,
  open,
  editable,
  missingFields,
  onToggle,
  onBriefChange,
  onFieldEdit,
}: FieldReviewProps): ReactElement {
  const missingSet = new Set(missingFields);
  const rows = fieldReviewRows(brief);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        className="w-fit cursor-pointer text-caption text-fg-muted"
        onClick={onToggle}
      >
        {open ? "▾" : "▸"} Review extracted fields
      </button>
      {open ? (
        <div className="flex flex-col gap-3 border-l-2 border-hairline pl-4">
          {!editable
            ? rows.map((row) => (
                <ReadOnlyRow
                  key={row.field}
                  label={row.label}
                  value={row.value}
                  missing={missingSet.has(row.field)}
                />
              ))
            : null}
          {editable ? (
            <div className="flex flex-col gap-4">
              {BRIEF_SCALAR_FIELDS.map(({ key, label, placeholder }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label htmlFor={key} className="text-label text-fg-muted">
                    {label}
                  </label>
                  <Input
                    id={key}
                    value={brief[key] as string}
                    placeholder={placeholder}
                    aria-invalid={missingSet.has(key)}
                    className={cn(
                      missingSet.has(key)
                        ? CAMPAIGN_INPUT_MISSING_CLASS
                        : CAMPAIGN_INPUT_CLASS,
                    )}
                    onChange={(event) => {
                      onFieldEdit(key);
                      onBriefChange({ ...brief, [key]: event.target.value });
                    }}
                  />
                </div>
              ))}
              <ChannelsField
                channels={brief.channels}
                proposed={false}
                missing={missingSet.has("channels")}
                onChange={(channels) => {
                  onFieldEdit("channels");
                  onBriefChange({ ...brief, channels });
                }}
              />
              <PerformanceFiguresField
                figures={brief.performanceFigures}
                proposed={false}
                onChange={(figures) => {
                  onFieldEdit("performanceFigures");
                  onBriefChange({ ...brief, performanceFigures: figures });
                }}
              />
              <ClaimsField
                claims={brief.claims}
                proposed={false}
                onChange={(claims) => {
                  onFieldEdit("claims");
                  onBriefChange({ ...brief, claims });
                }}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
