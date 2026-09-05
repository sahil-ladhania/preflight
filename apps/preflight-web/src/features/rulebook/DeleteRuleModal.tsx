import type { ReactElement } from "react";
import { useState } from "react";
import { PenLine, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DeleteRuleModalProps } from "@/features/rulebook/types";

export function DeleteRuleModal({
  rule,
  onClose,
  onConfirm,
}: DeleteRuleModalProps): ReactElement {
  const open = rule !== null;
  const [reason, setReason] = useState<string>("");

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) {
      setReason("");
      onClose();
    }
  };

  const handleConfirm = (): void => {
    onConfirm(reason.trim());
    setReason("");
  };

  if (!open || rule === null) {
    return <></>;
  }

  const reasonValid = reason.trim().length >= 10;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="rounded-none border border-fg bg-surface p-6 shadow-lift sm:max-w-[420px]"
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-sheet-title font-semibold text-fg">
            Delete this rule?
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-mono-meta text-fg">{rule.ruleId}</p>
            <p className="font-serif text-serif-row text-fg">{rule.wording}</p>
            <p className="font-sans text-caption leading-relaxed text-fg-muted">
              Assets that already cite this wording keep their frozen snapshot.
              Re-run strips will show{" "}
              <span className="font-mono text-mono-meta">frozen_rule_missing</span>{" "}
              for this rule id.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="delete-reason"
              className="inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.04em] text-fg-muted"
            >
              <PenLine
                className="size-3.5 shrink-0 text-fg-muted"
                aria-hidden
              />
              Change reason
            </Label>
            <Textarea
              id="delete-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="min-h-20 rounded-none font-sans text-sm leading-relaxed text-fg"
              placeholder="Mandatory reason for audit trail (min 10 characters)..."
            />
          </div>
        </div>
        <DialogFooter className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-none border border-hairline bg-surface px-4 font-sans text-button text-fg shadow-none hover:bg-hover"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="inline-flex h-8 items-center gap-1.5 rounded-none border border-fail bg-fail px-4 font-sans text-button text-surface shadow-none hover:bg-fail/90 disabled:opacity-50"
            disabled={!reasonValid}
            onClick={handleConfirm}
          >
            <Trash2 className="size-3 shrink-0" aria-hidden />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
