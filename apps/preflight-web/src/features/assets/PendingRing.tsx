/**
 * PendingRing — 8px hollow spin ring for list pending indicator.
 * Why: reserve ring slot before chip so rows align (09 default).
 */

import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

export function PendingRing({ active }: { active: boolean }): ReactElement {
  return (
    <span
      className={cn("pending-ring", !active && "pending-ring-slot")}
      aria-hidden
    />
  );
}
