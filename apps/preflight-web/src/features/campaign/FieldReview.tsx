/**
 * FieldReview — S1d collapsed eight-field review on a hairline rule.
 * Why: 09 Screen 3 prototype Label · value disclosure, not a full form grid.
 */

import { ChevronDown, ChevronRight } from "lucide-react";
import type { ReactElement } from "react";

import type { BriefField, StructuredBriefInput } from "@preflight/schemas";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ChannelsField,
  ClaimsField,
  PerformanceFiguresField,
} from "@/features/campaign/BriefArrayFields";
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
    <div className="flex flex-col gap-3">
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
        <span>Review extracted fields</span>
        <Badge
          variant="outline"
          className="rounded-none border-border font-mono text-[10px] font-normal text-fg-muted"
        >
          8 fields
        </Badge>
        {missingFields.length > 0 ? (
          <Badge
            variant="destructive"
            className="rounded-none font-mono text-[10px] font-normal uppercase"
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
                      "border-l-2 border-fail pl-2.5",
                  )}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">
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
              {/* Scalar Fields 2-col Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Objective - full width */}
                <div className="col-span-full flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="objective"
                      className="font-mono text-xs font-medium uppercase tracking-wider text-fg-muted"
                    >
                      Objective
                    </Label>
                    {missingSet.has("objective") ? (
                      <span className="font-sans text-[11px] text-fail">
                        Required
                      </span>
                    ) : null}
                  </div>
                  <Input
                    id="objective"
                    value={brief.objective}
                    placeholder="e.g. Drive awareness among digital investors"
                    aria-invalid={missingSet.has("objective")}
                    className={cn(
                      "rounded-none border-border bg-ground/40 font-serif text-sm text-fg shadow-none focus-visible:border-decision focus-visible:ring-0",
                      missingSet.has("objective") &&
                        "border-fail focus-visible:border-fail",
                    )}
                    onChange={(event) => {
                      onFieldEdit("objective");
                      onBriefChange({
                        ...brief,
                        objective: event.target.value,
                      });
                    }}
                  />
                </div>

                {/* Scheme Name */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="schemeName"
                      className="font-mono text-xs font-medium uppercase tracking-wider text-fg-muted"
                    >
                      Scheme name
                    </Label>
                    {missingSet.has("schemeName") ? (
                      <span className="font-sans text-[11px] text-fail">
                        Required
                      </span>
                    ) : null}
                  </div>
                  <Input
                    id="schemeName"
                    value={brief.schemeName}
                    placeholder="e.g. Bluepeak Flexi Cap Fund"
                    aria-invalid={missingSet.has("schemeName")}
                    className={cn(
                      "rounded-none border-border bg-ground/40 font-serif text-sm text-fg shadow-none focus-visible:border-decision focus-visible:ring-0",
                      missingSet.has("schemeName") &&
                        "border-fail focus-visible:border-fail",
                    )}
                    onChange={(event) => {
                      onFieldEdit("schemeName");
                      onBriefChange({
                        ...brief,
                        schemeName: event.target.value,
                      });
                    }}
                  />
                </div>

                {/* Scheme Category */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="schemeCategory"
                      className="font-mono text-xs font-medium uppercase tracking-wider text-fg-muted"
                    >
                      Scheme category
                    </Label>
                    {missingSet.has("schemeCategory") ? (
                      <span className="font-sans text-[11px] text-fail">
                        Required
                      </span>
                    ) : null}
                  </div>
                  <Input
                    id="schemeCategory"
                    value={brief.schemeCategory}
                    placeholder="e.g. Flexi Cap"
                    aria-invalid={missingSet.has("schemeCategory")}
                    className={cn(
                      "rounded-none border-border bg-ground/40 font-serif text-sm text-fg shadow-none focus-visible:border-decision focus-visible:ring-0",
                      missingSet.has("schemeCategory") &&
                        "border-fail focus-visible:border-fail",
                    )}
                    onChange={(event) => {
                      onFieldEdit("schemeCategory");
                      onBriefChange({
                        ...brief,
                        schemeCategory: event.target.value,
                      });
                    }}
                  />
                </div>

                {/* Audience */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="audience"
                      className="font-mono text-xs font-medium uppercase tracking-wider text-fg-muted"
                    >
                      Audience
                    </Label>
                    {missingSet.has("audience") ? (
                      <span className="font-sans text-[11px] text-fail">
                        Required
                      </span>
                    ) : null}
                  </div>
                  <Input
                    id="audience"
                    value={brief.audience}
                    placeholder="e.g. Retail investors in metro India"
                    aria-invalid={missingSet.has("audience")}
                    className={cn(
                      "rounded-none border-border bg-ground/40 font-serif text-sm text-fg shadow-none focus-visible:border-decision focus-visible:ring-0",
                      missingSet.has("audience") &&
                        "border-fail focus-visible:border-fail",
                    )}
                    onChange={(event) => {
                      onFieldEdit("audience");
                      onBriefChange({
                        ...brief,
                        audience: event.target.value,
                      });
                    }}
                  />
                </div>

                {/* Market */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="market"
                      className="font-mono text-xs font-medium uppercase tracking-wider text-fg-muted"
                    >
                      Market
                    </Label>
                    {missingSet.has("market") ? (
                      <span className="font-sans text-[11px] text-fail">
                        Required
                      </span>
                    ) : null}
                  </div>
                  <Input
                    id="market"
                    value={brief.market}
                    placeholder="e.g. India"
                    aria-invalid={missingSet.has("market")}
                    className={cn(
                      "rounded-none border-border bg-ground/40 font-serif text-sm text-fg shadow-none focus-visible:border-decision focus-visible:ring-0",
                      missingSet.has("market") &&
                        "border-fail focus-visible:border-fail",
                    )}
                    onChange={(event) => {
                      onFieldEdit("market");
                      onBriefChange({ ...brief, market: event.target.value });
                    }}
                  />
                </div>
              </div>

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
