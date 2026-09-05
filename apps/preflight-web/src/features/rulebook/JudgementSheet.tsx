/**
 * JudgementSheet — R3 add/edit form.
 * Why: R4 delete confirm for judgement rules.
 */
// size: add/edit sheet + impact blocks; extract worse than one local label helper

import type { ReactElement, ReactNode } from "react";
import {
  GitCompareArrows,
  Info,
  ListFilter,
  Loader2,
  PenLine,
  Pencil,
  Quote,
  Scale,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BRIEF_FIELD_LABELS,
  PREDICATE_FIELD_OPTIONS,
  formIsValid,
} from "@/features/rulebook/lib";
import { SheetShell } from "@/features/rulebook/SheetShell";
import type { JudgementSheetProps } from "@/features/rulebook/types";

const ADD_BANNER =
  "Judgement rules are LLM-evaluated and editable here. Deterministic rules are defined in code and read-only in the table.";

function SheetFieldLabel({
  htmlFor,
  label,
  icon,
}: {
  htmlFor?: string;
  label: string;
  icon: ReactNode;
}): ReactElement {
  return (
    <Label
      htmlFor={htmlFor}
      className="inline-flex items-center gap-1.5 font-sans text-[11px] font-normal uppercase tracking-[0.04em] text-fg-muted"
    >
      <span className="shrink-0 text-fg-muted" aria-hidden>
        {icon}
      </span>
      {label}
    </Label>
  );
}

export function JudgementSheet({
  mode,
  rule,
  form,
  saveInFlight,
  onFormChange,
  onSave,
  onCancel,
  onDelete,
}: JudgementSheetProps): ReactElement {
  const open = mode !== "closed";
  const isAdd = mode === "add";
  const disabled = saveInFlight;

  return (
    <SheetShell open={open} onClose={onCancel}>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-5">
            {isAdd ? (
              <>
                <div className="flex flex-col gap-0.5">
                  <h2 className="inline-flex items-center gap-2 font-serif text-sheet-title font-semibold text-fg">
                    <Scale className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
                    New judgement rule
                  </h2>
                  <span className="font-mono text-[11px] text-fg-muted">
                    ID assigned on save
                  </span>
                </div>
                <Card className="rounded-none border border-border bg-surface p-3 shadow-none">
                  <div className="flex gap-2.5">
                    <Info
                      className="size-3.5 shrink-0 text-fg-muted"
                      aria-hidden
                    />
                    <p className="font-sans text-caption leading-relaxed text-fg">
                      {ADD_BANNER}
                    </p>
                  </div>
                </Card>
              </>
            ) : null}

            {!isAdd && rule !== null ? (
              <div className="flex flex-col gap-0.5">
                <h2 className="inline-flex items-center gap-2 font-mono text-mono-meta font-semibold text-fg">
                  <Pencil className="size-3 shrink-0 text-fg-muted" aria-hidden />
                  {rule.ruleId}
                </h2>
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <SheetFieldLabel
                htmlFor="wording"
                label="Wording"
                icon={<Quote className="size-3.5" />}
              />
              <Textarea
                id="wording"
                value={form.wording}
                disabled={disabled}
                onChange={(event) =>
                  onFormChange({ ...form, wording: event.target.value })
                }
                className="min-h-24 rounded-none font-serif text-sm leading-relaxed text-fg"
                placeholder="Declare the rule wording..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <SheetFieldLabel
                label="Applicability"
                icon={<ListFilter className="size-3.5" />}
              />
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
            </div>

            {isAdd ? (
              <Card className="rounded-none border border-dashed border-border bg-surface/40 p-3 shadow-none">
                <div className="flex gap-2.5">
                  <Info
                    className="size-3.5 shrink-0 text-fg-muted"
                    aria-hidden
                  />
                  <p className="font-sans text-caption leading-relaxed text-fg-muted">
                    New rule — no assets can cite it until this is saved.
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="rounded-none border border-border bg-surface/40 p-3 shadow-none">
                <div className="flex gap-2.5">
                  <GitCompareArrows
                    className="size-3.5 shrink-0 text-fg-muted"
                    aria-hidden
                  />
                  <p className="font-sans text-caption leading-relaxed text-fg">
                    3 assets currently cite this wording. Editing it does not
                    change their ledgers — they keep the wording frozen at their
                    compile. The difference will show on each asset&apos;s
                    re-run strip as drift.
                  </p>
                </div>
              </Card>
            )}

            <div className="flex flex-col gap-1.5">
              <SheetFieldLabel
                htmlFor="change-reason"
                label="Change reason"
                icon={<PenLine className="size-3.5" />}
              />
              <Textarea
                id="change-reason"
                value={form.changeReason}
                disabled={disabled}
                onChange={(event) =>
                  onFormChange({ ...form, changeReason: event.target.value })
                }
                className="min-h-20 rounded-none font-sans text-sm leading-relaxed text-fg"
                placeholder="Reason for this change (required)..."
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border bg-surface p-4">
          {!isAdd ? (
            <Button
              type="button"
              variant="destructive"
              className="inline-flex h-8 items-center gap-1.5 rounded-none border-0 bg-transparent px-2 font-sans text-button text-fail shadow-none hover:bg-fail-wash"
              disabled={disabled}
              onClick={onDelete}
            >
              <Trash2 className="size-3 shrink-0" aria-hidden />
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-8 rounded-none border border-hairline bg-surface px-4 font-sans text-button text-fg shadow-none hover:bg-hover"
              disabled={disabled}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-8 rounded-none border border-primary bg-primary px-4 font-sans text-button text-primary-foreground shadow-xs hover:bg-primary-hover"
              disabled={disabled || !formIsValid(form)}
              onClick={onSave}
            >
              {saveInFlight ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </div>
    </SheetShell>
  );
}
