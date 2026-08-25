/**
 * CommentSheet — rounded message card inside the stage.
 * Why: user/assistant/error cards without chat bubbles (09 R2b–R2e).
 */

import type { ReactElement } from "react";

import type { CommentSheetProps } from "@/features/workbench/types";
import { cn } from "@/lib/utils";

export function CommentSheet({
  label,
  variant = "assistant",
  children,
}: CommentSheetProps): ReactElement {
  const showLabel = label !== undefined && variant !== "user";

  return (
    <div className="flex flex-col gap-1">
      {showLabel ? (
        <p className="text-caption text-fg-muted">{label}</p>
      ) : null}
      <div
        className={cn(
          "rounded-2xl px-4 py-3",
          variant === "user" && "bg-canvas-subtle",
          variant === "assistant" && "border border-border bg-canvas",
          variant === "error" && "border border-border bg-canvas",
        )}
      >
        {variant === "user" ? (
          <p className="mb-1 text-caption text-fg-muted">You</p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
