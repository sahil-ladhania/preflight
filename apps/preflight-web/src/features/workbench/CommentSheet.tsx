/**
 * CommentSheet — rounded message card inside the stage.
 * Why: user/assistant/error cards without chat bubbles (09 R2b–R2e).
 */

import type { ReactElement } from "react";

import type { CommentSheetProps } from "@/features/workbench/types";

export function CommentSheet({
  label,
  variant = "assistant",
  children,
}: CommentSheetProps): ReactElement {
  const displayLabel = variant === "user" ? "You" : label;

  return (
    <div className="border-t border-hairline pt-4 flex flex-col gap-1.5">
      {displayLabel !== undefined ? (
        <span className="font-sans text-caption text-fg-muted">
          {displayLabel}
        </span>
      ) : null}
      <div className="text-fg">
        {children}
      </div>
    </div>
  );
}
