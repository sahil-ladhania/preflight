/**
 * DeleteRuleModal — R4 delete confirm.
 * Why: hard delete confirmation before row removal.
 */

import type { ReactElement } from "react";
import { useState } from "react";

import { shortId } from "@/features/assets/lib";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { DeleteRuleModalProps } from "@/features/rulebook/types";

export function DeleteRuleModal({
  ruleId,
  onClose,
  onConfirm,
}: DeleteRuleModalProps): ReactElement {
  const open = ruleId !== null;
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

  if (!open) {
    return <></>;
  }

  const reasonValid = reason.trim().length >= 10;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this rule?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-body text-fg">
              Existing frozen snapshots still cite this rule.
            </p>
            <p className="text-mono text-caption text-fg-muted" title={ruleId}>
              {ruleId.length > 24 ? `${shortId(ruleId)}…` : ruleId}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="delete-reason" className="text-caption text-fg-muted">
              Change reason
            </label>
            <Textarea
              id="delete-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="min-h-20 text-body-airy"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!reasonValid}
            onClick={handleConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
