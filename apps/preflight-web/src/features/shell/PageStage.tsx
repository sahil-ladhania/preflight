/**
 * PageStage — bounded panel with optional full-viewport inset.
 * Why: shared Workbench + Assets list chrome. 08 §10 forbids the ambient wash
 * and the frosted backdrop this component used to carry; separation is border
 * and ground only, never depth.
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
        className={cn(
          "relative flex flex-col overflow-hidden",
          "border border-border bg-surface",
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
      <div className="relative flex h-below-topbar w-full flex-col p-2 sm:p-3">
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
