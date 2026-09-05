/**
 * OverviewShell — paper-ground column and PageHeader for Overview.
 * Why: shared register padding per 08 §13 amendment 7.
 */

import type { ReactElement, ReactNode } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { overviewAsOfStamp } from "@/features/overview/lib";
import { StateLine } from "@/features/overview/StateLine";
import type { OverviewStateCounts } from "@/features/overview/lib";
import type { PersonaId } from "@/features/shell/types";

export interface OverviewShellProps {
  stateCounts: OverviewStateCounts;
  personaId: PersonaId;
  children: ReactNode;
}

export function OverviewShell({
  stateCounts,
  personaId,
  children,
}: OverviewShellProps): ReactElement {
  const asOfLabel = overviewAsOfStamp(new Date());

  return (
    <div className="flex min-h-below-topbar shrink-0 flex-col bg-ground px-8 pt-8 pb-16">
      <div className="mx-auto flex w-full max-w-register flex-1 flex-col">
        <PageHeader
          eyebrow="OVERVIEW"
          title="What is unresolved"
          supportingLine={
            <StateLine counts={stateCounts} personaId={personaId} />
          }
          action={
            <span className="font-mono text-mono-faint uppercase text-fg-muted">
              {asOfLabel}
            </span>
          }
        />
        {children}
      </div>
    </div>
  );
}
