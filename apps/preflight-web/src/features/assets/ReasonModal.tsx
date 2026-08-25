/**
 * ReasonModal — R7 override / waive reason capture.
 * Why: required reason before human verdict write.
 */

import { useState, type ReactElement } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { ReasonModalProps } from "@/features/assets/types";

export function ReasonModal({
  mode,
  onClose,
  onSubmit,
}: ReasonModalProps): ReactElement {
  const [reason, setReason] = useState<string>("");
  const open = mode !== "closed";
  const title = mode === "override" ? "Override" : "Waive";
  const trimmed = reason.trim();
  const canSubmit = trimmed.length > 0;

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) {
      setReason("");
      onClose();
    }
  };

  const handleSubmit = (): void => {
    if (!canSubmit) {
      return;
    }
    // Will POST /findings/:id/decide or /waive with reason.
    onSubmit(trimmed);
    setReason("");
  };

  if (mode === "closed") {
    return <></>;
  }

  const placeholder =
    mode === "override"
      ? "Why are you overriding the machine verdict?"
      : "Why is this rule being waived?";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <label htmlFor="reason" className="text-caption text-fg-muted">
            Reason (required)
          </label>
          <Textarea
            id="reason"
            value={reason}
            placeholder={placeholder}
            onChange={(event) => setReason(event.target.value)}
            className="min-h-24 text-body-airy"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" disabled={!canSubmit} onClick={handleSubmit}>
            {title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
