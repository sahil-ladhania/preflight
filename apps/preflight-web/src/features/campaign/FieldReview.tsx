/**
 * FieldReview — S1d collapsed eight-field review on a hairline rule.
 * Why: 09 Screen 3 prototype Label · value disclosure, not a full form grid.
 */

import { ChevronDown, ChevronRight, ListChecks } from "lucide-react";
import type { ReactElement } from "react";

import type { BriefField, StructuredBriefInput } from "@preflight/schemas";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChannelsField,
  ClaimsField,
  PerformanceFiguresField,
} from "@/features/campaign/BriefArrayFields";
import { FieldReviewScalars } from "@/features/campaign/FieldReviewScalars";
import { fieldReviewRows } from "@/features/campaign/campaign-pane";
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
    <div className="flex flex-col gap-3 pb-8 md:pb-12">
      <button
        type="button"
        className="flex w-fit cursor-pointer items-center gap-2 border border-border bg-surface px-3 py-1.5 font-sans text-xs font-medium text-fg shadow-none transition-colors hover:bg-hover"
        onClick={onToggle}
      >
        {open ? (
          <ChevronDown className="size-3.5 text-fg-muted" />
        ) : (
          <ChevronRight className="size-3.5 text-fg-muted" />
        )}
        <ListChecks className="size-3.5 shrink-0 text-fg-muted" aria-hidden="true" />
        <span>Review extracted fields</span>
        <Badge
          variant="outline"
          className="rounded-none border-border font-mono text-[10px] font-normal text-fg-muted"
        >
          8 fields
        </Badge>
        {missingFields.length > 0 ? (
          <Badge
            variant="outline"
            className="rounded-none border-border font-mono text-[10px] font-normal uppercase text-fg-muted"
          >
            {missingFields.length} required
          </Badge>
        ) : null}
      </button>

      {open ? (
        <Card className="rounded-none border border-border bg-surface p-4 shadow-none md:p-5">
          {!editable ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
              {rows.map((row) => (
                <div
                  key={row.field}
                  className={cn(
                    "flex flex-col gap-0.5 border-b border-hairline/60 pb-2.5",
                    row.field === "objective" && "col-span-full",
                    missingSet.has(row.field) &&
                      "border-l-2 border-hairline/80 pl-2.5",
                  )}
                >
                  <span className="font-sans text-label uppercase tracking-wider text-fg-muted">
                    {row.label}
                  </span>
                  <span className="font-serif text-sm text-fg">
                    {row.value.trim().length > 0 ? row.value : "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <FieldReviewScalars
                brief={brief}
                missingSet={missingSet}
                onFieldEdit={onFieldEdit}
                onBriefChange={onBriefChange}
              />

              <Separator className="bg-border" />

              {/* Channels */}
              <ChannelsField
                channels={brief.channels}
                proposed={false}
                missing={missingSet.has("channels")}
                onChange={(channels) => {
                  onFieldEdit("channels");
                  onBriefChange({ ...brief, channels });
                }}
              />

              <Separator className="bg-border" />

              {/* Performance Figures & Claims */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <PerformanceFiguresField
                  figures={brief.performanceFigures}
                  proposed={false}
                  onChange={(figures) => {
                    onFieldEdit("performanceFigures");
                    onBriefChange({
                      ...brief,
                      performanceFigures: figures,
                    });
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
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}
