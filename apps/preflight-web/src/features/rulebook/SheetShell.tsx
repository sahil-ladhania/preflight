import type { ReactElement } from "react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { SheetShellProps } from "@/features/rulebook/types";

export function SheetShell({
  open,
  onClose,
  children,
}: SheetShellProps): ReactElement {
  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <SheetContent
        side="right"
        className="top-0 z-50 flex h-full w-[400px] flex-col gap-0 border-l border-fg bg-surface p-0 shadow-none sm:max-w-[400px]"
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
