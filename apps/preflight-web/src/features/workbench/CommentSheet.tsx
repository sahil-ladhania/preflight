/**
 * CommentSheet — bordered thread comment shell.
 * Why: GitHub conversation register; no bubbles.
 */

import type { ReactElement } from "react";

import type { CommentSheetProps } from "@/features/workbench/types";

export function CommentSheet({
  label,
  children,
}: CommentSheetProps): ReactElement {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-caption text-fg-muted">{label}</p>
      <div className="rounded-md border border-border bg-canvas px-4 py-3">
        {children}
      </div>
    </div>
  );
}
