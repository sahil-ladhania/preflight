/**
 * PageStage — frosted panel with optional full-viewport inset.
 * Why: shared Workbench + Assets list stage chrome (08 register).
 */

import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface PageStageProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

function StagePanel({
  children,
  className,
  fullHeight,
}: {
  children: ReactNode;
  className?: string;
  fullHeight: boolean;
}): ReactElement {
  return (
    <div
      className={cn(
        fullHeight ? "relative flex min-h-0 flex-1 flex-col" : "relative flex flex-col",
        "w-full",
      )}
    >
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className={cn(
          "relative flex flex-col overflow-hidden",
          "rounded-2xl border border-border bg-canvas/80 backdrop-blur-md",
          fullHeight && "min-h-0 flex-1",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function PageStage({
  children,
  className,
  fullHeight = true,
}: PageStageProps): ReactElement {
  if (fullHeight) {
    return (
      <div className="relative flex h-[calc(100vh-3rem)] w-full flex-col p-2 sm:p-3">
        <StagePanel className={className} fullHeight>
          {children}
        </StagePanel>
      </div>
    );
  }

  return (
    <StagePanel className={className} fullHeight={false}>
      {children}
    </StagePanel>
  );
}
