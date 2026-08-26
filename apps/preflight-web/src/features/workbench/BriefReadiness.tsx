/**
 * BriefReadiness — captured vs still-needed line above composer.
 * Why: operator sees progress without guessing what the agent knows.
 */

import type { ReactElement } from "react";

import { briefFieldLabel } from "@preflight/schemas";
import type { BriefField } from "@preflight/schemas";

export function BriefReadiness({
  capturedCount,
  missing,
  complete,
}: {
  capturedCount: number;
  missing: BriefField[];
  complete: boolean;
}): ReactElement | null {
  if (complete) {
    return (
      <p className="text-caption text-primary">
        Brief complete — click Start campaign from this conversation.
      </p>
    );
  }

  if (capturedCount === 0 && missing.length > 0) {
    return (
      <p className="text-caption text-fg-muted">
        Preflight will capture your brief as you chat.
      </p>
    );
  }

  const capturedLabel =
    capturedCount === 1 ? "1 field captured" : `${capturedCount} fields captured`;
  const missingLabels = missing.map(briefFieldLabel).join(", ");

  return (
    <p className="text-caption text-fg-muted">
      {capturedLabel}
      {missing.length > 0 ? ` · still need ${missingLabels}` : null}
    </p>
  );
}
