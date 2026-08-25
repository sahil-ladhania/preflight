/**
 * DeleteRuleModal — R4 delete confirm.
 * Why: hard delete confirmation before row removal.
 */

import type { ReactElement } from "react";

import { shortId } from "@/features/assets/lib";
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
          <DialogTitle>Delete this rule?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <p className="text-body text-fg">
            Existing frozen snapshots still cite this rule.
          </p>
          <p className="text-mono text-caption text-fg-muted" title={ruleId}>
            {ruleId.length > 24 ? `${shortId(ruleId)}…` : ruleId}
          </p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
