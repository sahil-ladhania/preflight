/**
 * OverviewSectionHeading — shared section title with optional count and icon.
 * Why: wordmark serif headings match Asset Register sections; large for thesis blocks.
 */

import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function OverviewSectionHeading({
  title,
  count,
  icon,
  size = "default",
}: {
  title: string;
  count?: number;
  icon?: ReactNode;
  size?: "default" | "large";
}): ReactElement {
  const isLarge = size === "large";

  return (
    <div
      className={cn(
        "flex gap-2.5 pb-1",
        isLarge ? "items-center" : "items-baseline",
      )}
    >
      <span
        className={cn(
          "inline-flex",
          isLarge ? "items-center gap-2.5" : "items-center gap-2",
        )}
      >
        {icon !== undefined ? (
          <span className="shrink-0 text-fg-muted" aria-hidden>
            {icon}
          </span>
        ) : null}
        <h2
          className={cn(
            "font-serif font-semibold tracking-tight text-fg",
            isLarge ? "text-subject-title" : "text-wordmark",
          )}
        >
          {title}
        </h2>
      </span>
      {count !== undefined ? (
        <span className="font-mono text-xs text-fg-muted">[{count}]</span>
      ) : null}
    </div>
  );
}
