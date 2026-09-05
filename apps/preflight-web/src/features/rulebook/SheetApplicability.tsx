/**
 * SheetApplicability — add-mode predicate controls + preview; edit read-only line.
 * Why: extracted from JudgementSheet for file size and 09 R3 add vs edit split.
 */

import type { ReactElement } from "react";
import { ListFilter } from "lucide-react";

import type { RuleCatalogRowDTO } from "@preflight/schemas";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  appliesLabel,
  BRIEF_FIELD_LABELS,
  formatPredicateSpec,
  parsePredicateSpec,
  PREDICATE_FIELD_OPTIONS,
} from "@/features/rulebook/lib";
import type { JudgementFormState, SheetMode } from "@/features/rulebook/types";

function SheetFieldLabel({
  label,
  icon,
}: {
  label: string;
  icon: ReactElement;
}): ReactElement {
  return (
    <Label className="inline-flex items-center gap-1.5 font-sans text-[11px] font-normal uppercase tracking-[0.04em] text-fg-muted">
      <span className="shrink-0 text-fg-muted" aria-hidden>
        {icon}
      </span>
      {label}
    </Label>
  );
}

function appliesPreview(form: JudgementFormState): string {
  const spec = parsePredicateSpec(form);
  if (spec === null) {
    return "Applies to: enter a value above.";
  }
  return formatPredicateSpec(spec);
}

export function SheetApplicability({
  mode,
  rule,
  form,
  disabled,
  onFormChange,
}: {
  mode: SheetMode;
  rule: RuleCatalogRowDTO | null;
  form: JudgementFormState;
  disabled: boolean;
  onFormChange: (form: JudgementFormState) => void;
}): ReactElement {
  const isAdd = mode === "add";

  return (
    <div className="flex flex-col gap-1.5">
      <SheetFieldLabel label="Applicability" icon={<ListFilter className="size-3.5" />} />
      {isAdd ? (
        <>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Select
              value={form.field}
              disabled={disabled}
              onValueChange={(value) =>
                onFormChange({
                  ...form,
                  field: value as typeof form.field,
                })
              }
            >
              <SelectTrigger
                className="h-8 w-full rounded-none border border-border bg-surface px-2.5 text-xs text-fg"
                aria-label="Predicate field"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PREDICATE_FIELD_OPTIONS.map((field) => (
                  <SelectItem key={field} value={field}>
                    {BRIEF_FIELD_LABELS[field]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={form.op}
              disabled={disabled}
              onValueChange={(value) =>
                onFormChange({
                  ...form,
                  op: value as typeof form.op,
                })
              }
            >
              <SelectTrigger
                className="h-8 w-full rounded-none border border-border bg-surface px-2.5 text-xs text-fg"
                aria-label="Predicate operator"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">equals</SelectItem>
                <SelectItem value="in">in</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={form.valueText}
              disabled={disabled}
              placeholder={form.op === "in" ? "a, b, c" : "value"}
              onChange={(event) =>
                onFormChange({ ...form, valueText: event.target.value })
              }
              className="h-8 rounded-none border border-border bg-surface px-2.5 font-mono text-xs text-fg"
            />
          </div>
          <p className="font-sans text-caption text-fg-muted">{appliesPreview(form)}</p>
        </>
      ) : (
        <p className="font-serif text-serif-row text-fg">
          {rule !== null ? appliesLabel(rule) : "Every campaign"}
        </p>
      )}
    </div>
  );
}
