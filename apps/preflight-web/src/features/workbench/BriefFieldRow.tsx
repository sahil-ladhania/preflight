/**
 * BriefFieldRow — label/value row in the campaign brief rail.
 * Why: context-column structure; empty slots are not input silhouettes (B1).
 */

import type { ReactElement } from "react";

export interface BriefFieldRowProps {
  label: string;
  value: string | null;
  optional?: boolean;
  requiredComplete?: boolean;
  ariaSuffix?: string;
}

export function BriefFieldRow({
  label,
  value,
  optional = false,
  requiredComplete = false,
  ariaSuffix = "",
}: BriefFieldRowProps): ReactElement {
  const showEmptyOptional =
    optional && requiredComplete && (value === null || value.trim().length === 0);

  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
        {label}
      </span>
      {value !== null && value.trim().length > 0 ? (
        <p className="font-serif text-serif-row text-fg">{value}</p>
      ) : showEmptyOptional ? (
        <p className="font-sans text-caption text-fg-faint">none</p>
      ) : (
        <div
          className="flex flex-col gap-0.5"
          aria-label={`${label} ${ariaSuffix}`.trim()}
        >
          <span className="font-serif text-copy text-fg-faint">—</span>
          <span className="h-px w-8 border-t border-dashed border-hairline" aria-hidden />
        </div>
      )}
    </div>
  );
}
