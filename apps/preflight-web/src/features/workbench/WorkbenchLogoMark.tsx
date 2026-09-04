/**
 * WorkbenchLogoMark — Preflight gutter+span at stage size.
 * Why: centered empty-stage branding (08 logo spec, primary fill).
 */

import type { ReactElement } from "react";

import { PreflightMark } from "@/features/shell/PreflightMark";

export interface WorkbenchLogoMarkProps {
  size?: number;
  className?: string;
}

export function WorkbenchLogoMark({
  size = 40,
  className,
}: WorkbenchLogoMarkProps): ReactElement {
  return (
    <PreflightMark size={size} className={className ?? "text-primary"} />
  );
}
