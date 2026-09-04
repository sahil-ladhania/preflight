/**
 * PreflightMark — the two-rect gutter+span that is the product's only mark.
 * Why: used on login and workbench; extracted on second use per DRY rule.
 */

import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

export interface PreflightMarkProps {
  size?: number;
  className?: string;
}

export function PreflightMark({
  size = 40,
  className,
}: PreflightMarkProps): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect x="6" y="4" width="2" height="16" fill="currentColor" />
      <rect x="6" y="14" width="12" height="2" fill="currentColor" />
    </svg>
  );
}
