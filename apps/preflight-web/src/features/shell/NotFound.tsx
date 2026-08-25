/**
 * NotFound — R404 unknown URL page.
 * Why: shell outlet for invalid routes.
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

export function NotFound(): ReactElement {
  return (
    <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center px-4">
      <p className="text-caption text-fg-muted">
        Page not found ·{" "}
        <Link to="/assets" className="text-primary underline">
          Assets
        </Link>
      </p>
    </div>
  );
}
