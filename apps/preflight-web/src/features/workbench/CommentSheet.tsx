/**
 * CommentSheet — message container inside the stage.
 * Why: operator turn contained on right; preflight turn flush on left (08 §5.7).
 */

import type { ReactElement } from "react";

import type { CommentSheetProps } from "@/features/workbench/types";

export function CommentSheet({
  label,
  variant = "assistant",
  children,
}: CommentSheetProps): ReactElement {
  if (variant === "user") {
    return (
      <div className="flex w-full flex-col items-end">
        <span className="mb-1 text-right font-sans text-caption text-fg-muted">
          You
        </span>
        <div className="max-w-measure-thread rounded-none border border-hairline border-r-2 border-r-decision bg-hover p-[12px_16px] text-left text-fg">
          {children}
        </div>
      </div>
    );
  }

  const displayLabel = label ?? "Preflight";

  return (
    <div className="flex w-full flex-col items-start">
      <span className="mb-1 text-left font-sans text-caption text-fg-muted">
        {displayLabel}
      </span>
      <div className="w-full max-w-measure-thread text-fg">{children}</div>
    </div>
  );
}
