/**
 * OverviewShell — paper-ground column and PageHeader for Overview.
 * Why: shared register padding per 08 §13 amendment 7.
 */

import type { ReactElement, ReactNode } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { StateLine } from "@/features/overview/StateLine";
import type { OverviewStateCounts } from "@/features/overview/lib";

export interface OverviewShellProps {
  stateCounts: OverviewStateCounts;
  children: ReactNode;
}

export function OverviewShell({
  stateCounts,
  children,
}: OverviewShellProps): ReactElement {
  return (
    <div className="flex min-h-below-topbar shrink-0 flex-col bg-ground px-8 pt-8 pb-16">
      <div className="mx-auto flex w-full max-w-register flex-1 flex-col">
        <PageHeader
          className="mb-8"
          eyebrow="OVERVIEW"
          title="What is unresolved"
          supportingLine={<StateLine counts={stateCounts} />}
        />
        {children}
      </div>
    </div>
  );
}
