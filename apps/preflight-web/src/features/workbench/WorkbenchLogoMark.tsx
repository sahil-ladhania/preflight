/**
 * WorkbenchLogoMark — Preflight gutter+span at stage size.
 * Why: centered empty-stage branding (08 logo spec, primary fill).
 */

import type { ReactElement } from "react";

export function WorkbenchLogoMark(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="40"
      height="40"
      role="img"
      aria-hidden="true"
      className="shrink-0 text-primary"
    >
      <rect x="6" y="4" width="2" height="16" fill="currentColor" />
      <rect x="6" y="14" width="12" height="2" fill="currentColor" />
    </svg>
  );
}
