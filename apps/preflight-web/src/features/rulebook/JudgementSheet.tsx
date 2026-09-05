/**
 * JudgementSheet — R3 add/edit form.
 * Why: R4 delete confirm for judgement rules.
 */
// size: sheet footer save gate + impact blocks; applicability lives in SheetApplicability

import type { ReactElement, ReactNode } from "react";
import {
  GitCompareArrows,
  Info,
  Loader2,
  PenLine,
  Pencil,
  Quote,
  Scale,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SheetApplicability } from "@/features/rulebook/SheetApplicability";
import {
  formIsValid,
  saveBlockedReason,
} from "@/features/rulebook/lib";
import { SheetShell } from "@/features/rulebook/SheetShell";
import type { JudgementSheetProps } from "@/features/rulebook/types";
import { cn } from "@/lib/utils";

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
  const canSave = formIsValid(form, mode);
  const blockedReason = saveBlockedReason(form, mode);

  return (
    <SheetShell open={open} onClose={onCancel}>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-7">
          <div className="flex flex-col gap-4">
            {isAdd ? (
              <div className="flex flex-col gap-0.5">
                <h2 className="inline-flex items-center gap-2 font-serif text-sheet-title font-semibold text-fg">
                  <Scale className="size-3.5 shrink-0 text-fg-muted" aria-hidden />
                  New judgement rule
                </h2>
                <span className="font-mono text-[11px] text-fg-muted">
                  ID assigned on save
                </span>
              </div>
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

            <SheetApplicability
              mode={mode}
              rule={rule}
              form={form}
              disabled={disabled}
              onFormChange={onFormChange}
            />

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
              <Card className="rounded-none border border-hairline bg-surface p-3 shadow-none">
                <div className="flex gap-2.5">
                  <GitCompareArrows
                    className="size-3.5 shrink-0 text-fg-muted"
                    aria-hidden
                  />
                  <p className="font-sans text-caption leading-relaxed text-fg">
                    Assets that already cite this wording keep it frozen at their
                    compile. Editing it does not change their ledgers — the
                    difference shows on each asset&apos;s re-run strip as drift.
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
                placeholder="Reason for this change…"
              />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-border bg-surface p-4">
          {!canSave && blockedReason !== null && !disabled ? (
            <p className="text-caption text-fg-muted">{blockedReason}</p>
          ) : null}
          <div className="flex items-center justify-between gap-2">
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
                disabled={disabled || !canSave}
                className={cn(
                  "h-8 rounded-none px-4 font-sans text-button shadow-none",
                  canSave && !disabled
                    ? "border border-primary bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover"
                    : "cursor-not-allowed border border-hairline bg-transparent text-fg-faint",
                )}
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
      </div>
    </SheetShell>
  );
}
