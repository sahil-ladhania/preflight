/**
 * OverviewSectionHeading — shared section title with optional count and icon.
 * Why: wordmark serif headings match Asset Register sections; icons label region job.
 */

import type { ReactElement, ReactNode } from "react";

export function OverviewSectionHeading({
  title,
  count,
  icon,
}: {
  title: string;
  count?: number;
  icon?: ReactNode;
}): ReactElement {
  return (
    <div className="flex items-baseline gap-2.5 pb-1">
      <span className="inline-flex items-center gap-2">
        {icon !== undefined ? (
          <span className="shrink-0 text-fg-muted" aria-hidden>
            {icon}
          </span>
        ) : null}
        <h2 className="font-serif text-wordmark font-semibold tracking-tight text-fg">
          {title}
        </h2>
      </span>
      {count !== undefined ? (
        <span className="font-mono text-xs text-fg-muted">[{count}]</span>
      ) : null}
    </div>
  );
}
