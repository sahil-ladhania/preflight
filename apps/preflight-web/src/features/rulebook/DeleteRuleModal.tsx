/**
 * DeleteRuleModal — R4 delete confirm.
 * Why: hard delete confirmation before row removal.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DeleteRuleModalProps } from "@/features/rulebook/types";

export function DeleteRuleModal({
  ruleId,
  onClose,
  onConfirm,
}: DeleteRuleModalProps): ReactElement {
  const open = ruleId !== null;

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) {
      onClose();
    }
  };

  if (!open) {
    return <></>;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {ruleId}?</DialogTitle>
        </DialogHeader>
        <p className="text-body text-fg">
          Existing frozen snapshots still cite this rule.
        </p>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
