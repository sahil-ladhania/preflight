/**
 * ReasonModal — R7 override / waive reason capture.
 * Why: required reason before human verdict write.
 */

import { useState, type ReactElement } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { ReasonModalProps } from "@/features/assets/types";

const PERMANENCE_WARNING =
  "This becomes a permanent exception. Both the machine's finding and your decision stay visible on the record.";

export function ReasonModal({
  mode,
  onClose,
  onSubmit,
  ruleId,
  frozenWording,
  machineReason,
}: ReasonModalProps): ReactElement {
  const [reason, setReason] = useState<string>("");
  const open = mode !== "closed";
  const title = mode === "override" ? "Override" : "Waive";
  const trimmed = reason.trim();
  const minLength = mode === "waive" ? 20 : 1;
  const canSubmit = trimmed.length >= minLength;

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
      <DialogContent className="gap-4 border-fg sm:max-w-modal">
        <DialogHeader>
          <DialogTitle className="font-serif text-sheet-title">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {ruleId !== undefined ? (
            <p className="font-mono text-mono-faint text-fg-muted">{ruleId}</p>
          ) : null}
          {frozenWording !== undefined ? (
            <p className="font-serif text-copy text-fg">{frozenWording}</p>
          ) : null}
          {machineReason !== null && machineReason !== undefined ? (
            <p className="font-sans text-caption text-fg-muted">
              Machine finding: {machineReason}
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            <label htmlFor="reason" className="text-label uppercase text-fg-muted">
              Reason (required)
            </label>
            <Textarea
              id="reason"
              value={reason}
              placeholder={placeholder}
              onChange={(event) => setReason(event.target.value)}
              className="min-h-[72px] border-hairline font-sans text-ui"
            />
            {mode === "waive" ? (
              <p className="font-sans text-mono-faint text-fg-faint">
                Minimum 20 characters.
              </p>
            ) : null}
          </div>
          {mode === "waive" ? (
            <p className="font-sans text-caption text-fail">{PERMANENCE_WARNING}</p>
          ) : null}
        </div>
        <DialogFooter className="gap-2">
          <button
            type="button"
            className="inline-flex h-8 cursor-pointer items-center justify-center border border-hairline px-4 font-sans text-button text-fg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-8 cursor-pointer items-center justify-center border border-decision px-4 font-sans text-button font-medium text-decision disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {title}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
