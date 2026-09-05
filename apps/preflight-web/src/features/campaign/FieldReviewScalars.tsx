/**
 * FieldReviewScalars — scalar input fields (objective, scheme, category, audience, market).
 * Why: extracted from FieldReview to maintain <= 200 line limit (size-and-dry.mdc).
 */

import type { ReactElement } from "react";
import type { BriefField, StructuredBriefInput } from "@preflight/schemas";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FieldReviewScalarsProps {
  brief: StructuredBriefInput;
  missingSet: Set<BriefField>;
  onFieldEdit: (field: BriefField) => void;
  onBriefChange: (brief: StructuredBriefInput) => void;
}

interface ScalarFieldConfig {
  id: BriefField;
  label: string;
  placeholder: string;
  fullWidth?: boolean;
}

const SCALAR_CONFIGS: ScalarFieldConfig[] = [
  {
    id: "objective",
    label: "Objective",
    placeholder: "e.g. Drive awareness among digital investors",
    fullWidth: true,
  },
  {
    id: "schemeName",
    label: "Scheme name",
    placeholder: "e.g. Bluepeak Flexi Cap Fund",
  },
  {
    id: "schemeCategory",
    label: "Scheme category",
    placeholder: "e.g. Flexi Cap",
  },
  {
    id: "audience",
    label: "Audience",
    placeholder: "e.g. Retail investors in metro India",
  },
  {
    id: "market",
    label: "Market",
    placeholder: "e.g. India",
  },
];

export function FieldReviewScalars({
  brief,
  missingSet,
  onFieldEdit,
  onBriefChange,
}: FieldReviewScalarsProps): ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {SCALAR_CONFIGS.map(({ id, label, placeholder, fullWidth }) => {
        const isMissing = missingSet.has(id);
        const value = (brief[id] as string) ?? "";

        return (
          <div
            key={id}
            className={cn("flex flex-col gap-1.5", fullWidth && "col-span-full")}
          >
            <div className="flex items-center justify-between">
              <Label
                htmlFor={id}
                className="font-sans text-label font-medium uppercase tracking-wider text-fg-muted"
              >
                {label}
              </Label>
              {isMissing ? (
                <span className="font-sans text-[11px] text-fg-muted">
                  Required
                </span>
              ) : null}
            </div>
            <Input
              id={id}
              value={value}
              placeholder={placeholder}
              aria-invalid={isMissing}
              className={cn(
                "rounded-none border-border bg-ground/40 font-serif text-sm text-fg shadow-none focus-visible:border-decision focus-visible:ring-0",
                isMissing && "border-hairline/80",
              )}
              onChange={(event) => {
                onFieldEdit(id);
                onBriefChange({
                  ...brief,
                  [id]: event.target.value,
                });
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
