/**
 * JudgementSheet — R3 add/edit form.
 * Why: R4 delete confirm for judgement rules.
 */

import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BRIEF_FIELD_LABELS,
  PREDICATE_FIELD_OPTIONS,
  formIsValid,
} from "@/features/rulebook/lib";
import { SheetShell } from "@/features/rulebook/SheetShell";
import type { JudgementSheetProps } from "@/features/rulebook/types";

const SELECT_CLASS =
  "h-auto w-full rounded-md border border-border bg-canvas px-4 py-3 text-body text-fg";

const ADD_BANNER =
  "Judgement rules are LLM-evaluated and editable here. Deterministic rules are defined in code and read-only in the table.";

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
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
        {isAdd ? (
          <div className="mb-4 rounded-md border border-border bg-canvas px-4 py-3">
            <p className="text-body-airy text-fg">{ADD_BANNER}</p>
          </div>
        ) : null}
        {!isAdd && rule !== null ? (
          <p className="mb-4 text-mono text-caption text-fg-muted">
            {rule.ruleId}
          </p>
        ) : null}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="wording" className="text-caption text-fg-muted">
              Wording
            </label>
            <Textarea
              id="wording"
              value={form.wording}
              disabled={disabled}
              onChange={(event) =>
                onFormChange({ ...form, wording: event.target.value })
              }
              className="min-h-24 text-body-airy"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-caption text-fg-muted">Applicability</p>
            <div className="grid grid-cols-3 gap-2">
              <select
                aria-label="Predicate field"
                className={SELECT_CLASS}
                disabled={disabled}
                value={form.field}
                onChange={(event) =>
                  onFormChange({
                    ...form,
                    field: event.target.value as typeof form.field,
                  })
                }
              >
                {PREDICATE_FIELD_OPTIONS.map((field) => (
                  <option key={field} value={field}>
                    {BRIEF_FIELD_LABELS[field]}
                  </option>
                ))}
              </select>
              <select
                aria-label="Predicate operator"
                className={SELECT_CLASS}
                disabled={disabled}
                value={form.op}
                onChange={(event) =>
                  onFormChange({
                    ...form,
                    op: event.target.value as typeof form.op,
                  })
                }
              >
                <option value="equals">equals</option>
                <option value="in">in</option>
              </select>
              <Input
                value={form.valueText}
                disabled={disabled}
                placeholder={form.op === "in" ? "a, b, c" : "value"}
                onChange={(event) =>
                  onFormChange({ ...form, valueText: event.target.value })
                }
                className="h-auto px-4 py-3 text-body-airy"
              />
            </div>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-6">
          {!isAdd ? (
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={onDelete}
            >
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
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
