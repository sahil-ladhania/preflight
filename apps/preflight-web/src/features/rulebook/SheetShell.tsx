/**
 * SheetShell — R3 right slide-over panel.
 * Why: 480px sheet below top bar with overlay.
 */

import type { ReactElement } from "react";

import type { SheetShellProps } from "@/features/rulebook/types";

export function SheetShell({
  open,
  onClose,
  children,
}: SheetShellProps): ReactElement {
  if (!open) {
    return <></>;
  }

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close sheet"
        className="absolute inset-0 top-12 bg-canvas-subtle/50"
        onClick={onClose}
      />
      <aside className="absolute top-12 right-0 bottom-0 flex w-[480px] flex-col border-l border-border bg-canvas">
        {children}
      </aside>
    </div>
  );
}
