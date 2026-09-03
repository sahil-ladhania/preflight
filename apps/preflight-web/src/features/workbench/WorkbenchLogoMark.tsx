/**
 * WorkbenchLogoMark — Preflight gutter+span at stage size.
 * Why: centered empty-stage branding (08 logo spec, primary fill).
 */

import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

export interface WorkbenchLogoMarkProps {
  size?: number;
  className?: string;
}

export function WorkbenchLogoMark({
  size = 40,
  className,
}: WorkbenchLogoMarkProps): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      aria-hidden="true"
      className={cn("shrink-0 text-primary", className)}
    >
      <rect x="6" y="4" width="2" height="16" fill="currentColor" />
      <rect x="6" y="14" width="12" height="2" fill="currentColor" />
    </svg>
  );
}
