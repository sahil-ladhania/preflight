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
import type { ReasonModalProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

const MIN_REASON = 20;

const PERMANENCE_WARNING =
  "This becomes a permanent exception. Both the machine's finding and your decision stay visible on the record.";

const OVERRIDE_CONSEQUENCE =
  "Records that this finding is not a violation. The machine's finding stays on the record.";

const HELPER_COPY = {
  waive:
    "Name the rule, the specific circumstance, and why the exposure is acceptable.",
  override: "Explain why the machine's reading does not apply to this copy.",
} as const;

const buttonTypeClass =
  "font-sans text-(length:--text-button) leading-none font-medium";

const cancelButtonClass = cn(
  "inline-flex h-8 cursor-pointer items-center justify-center rounded-none border border-hairline bg-surface px-4 text-fg",
  buttonTypeClass,
);

const waiveConfirmClass = cn(
  "inline-flex h-8 cursor-pointer items-center justify-center rounded-none border border-decision bg-surface px-4 text-decision disabled:cursor-not-allowed disabled:opacity-50",
  buttonTypeClass,
);

const overrideConfirmClass = cn(
  "inline-flex h-8 cursor-pointer items-center justify-center rounded-none border border-fg bg-surface px-4 text-fg disabled:cursor-not-allowed disabled:opacity-50",
  buttonTypeClass,
);

const modalShellClass = cn(
  "w-full max-w-[480px] gap-4 rounded-none border border-fg bg-surface p-7 text-fg shadow-none ring-0",
  "duration-0 data-open:animate-none data-closed:animate-none",
);

const modalOverlayClass = cn(
  "bg-[rgba(28,26,23,0.5)] backdrop-blur-none duration-0",
  "data-open:animate-none data-closed:animate-none",
);

const textareaClass = cn(
  "field-sizing-content min-h-[72px] w-full rounded-none border border-hairline bg-transparent px-3 py-2",
  "font-sans text-(length:--text-ui) leading-normal outline-none",
  "focus-visible:border-decision focus-visible:ring-0",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

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
  const canSubmit = trimmed.length >= MIN_REASON;

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

  const helperCopy = HELPER_COPY[mode];
  const confirmClass = mode === "waive" ? waiveConfirmClass : overrideConfirmClass;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName={modalOverlayClass}
        className={modalShellClass}
      >
        <DialogHeader className="gap-0">
          <DialogTitle className="font-serif text-sheet-title text-fg">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {ruleId !== undefined ? (
            <p className="font-mono text-mono-faint text-fg-muted">{ruleId}</p>
          ) : null}
          {frozenWording !== undefined ? (
            <p className="font-serif text-copy text-fg">{frozenWording}</p>
          ) : null}
          {machineReason !== null && machineReason !== undefined ? (
            <p className="font-sans text-caption font-normal text-fg-muted">
              Machine finding: {machineReason}
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="reason"
              className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted"
            >
              Reason (required)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className={textareaClass}
            />
            <p className="font-sans text-caption font-normal text-fg-muted">
              {helperCopy}
            </p>
            <p className="font-sans text-(length:--text-label) text-fg-faint">
              {trimmed.length} / {MIN_REASON} characters.
            </p>
          </div>
          {mode === "waive" ? (
            <p className="font-sans text-caption text-fail">{PERMANENCE_WARNING}</p>
          ) : (
            <p className="font-sans text-caption font-normal text-fg-muted">
              {OVERRIDE_CONSEQUENCE}
            </p>
          )}
        </div>
        <DialogFooter className="mx-0 mb-0 flex flex-row justify-end gap-2 border-0 bg-transparent p-0">
          <button type="button" className={cancelButtonClass} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={confirmClass}
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
