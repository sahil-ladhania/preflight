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
      <div className="flex flex-col items-end w-full">
        <span className="font-sans text-caption text-fg-muted mb-1 text-right">
          You
        </span>
        <div className="bg-hover border border-hairline border-r-2 border-r-decision p-[12px_16px] max-w-[72%] rounded-none text-left text-fg">
          {children}
        </div>
      </div>
    );
  }

  const displayLabel = label ?? "Preflight";

  return (
    <div className="flex flex-col items-start w-full">
      <span className="font-sans text-caption text-fg-muted mb-1 text-left">
        {displayLabel}
      </span>
      <div className="w-full max-w-[88%] text-fg">
        {children}
      </div>
    </div>
  );
}

