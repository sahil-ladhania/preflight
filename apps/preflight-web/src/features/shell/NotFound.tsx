/**
 * NotFound — R404 unknown URL page.
 * Why: shell outlet for invalid routes.
 */

import type { ReactElement } from "react";

import { usePersonaHomeNavigation } from "@/features/shell/usePersonaHomeNavigation";

export function NotFound(): ReactElement {
  const { navigatingHome, goHome } = usePersonaHomeNavigation();

  const homeLabel = "Overview";

  return (
    <div className="flex min-h-below-topbar items-center justify-center px-4">
      <p className="text-caption text-fg-muted">
        Page not found ·{" "}
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-primary underline"
          disabled={navigatingHome}
          onClick={() => {
            void goHome();
          }}
        >
          {homeLabel}
        </button>
      </p>
    </div>
  );
}
