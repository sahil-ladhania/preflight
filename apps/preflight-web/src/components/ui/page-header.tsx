/**
 * PageHeader — standard header block for Campaign, Rulebook, and Asset Register.
 * Why: single shared header pattern with 48px body separation (08 §5.2 / Phase 1b).
 */

import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  supportingLine?: ReactNode;
  search?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  supportingLine,
  search,
  action,
  className,
}: PageHeaderProps): ReactElement {
  return (
    <header className={cn("mb-12 flex flex-col gap-2", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex flex-col gap-1">
          {eyebrow ? (
            <span className="font-mono text-[11px] font-medium tracking-wider text-fg-muted uppercase">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="font-serif text-page-title font-semibold tracking-tight text-fg">
            {title}
          </h1>
        </div>

        {search !== undefined || action !== undefined ? (
          <div className="flex items-center gap-3">
            {search}
            {action}
          </div>
        ) : null}
      </div>

      {supportingLine ? (
        <div className="text-ui text-fg-muted">{supportingLine}</div>
      ) : null}
    </header>
  );
}
