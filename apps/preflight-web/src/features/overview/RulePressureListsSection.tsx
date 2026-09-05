/**
 * RulePressureListsSection — most-failed and most-waived ranked lists.
 * Why: wide-column table region in Overview two-column layout.
 */

import type { ReactElement, ReactNode } from "react";
import { CircleX, Gauge, Scale } from "lucide-react";

import { cn } from "@/lib/utils";

import { OverviewRegion } from "@/features/overview/OverviewRegion";
import { OverviewSectionHeading } from "@/features/overview/OverviewSectionHeading";
import { RegisterLink } from "@/features/overview/RegisterLink";
import { RulePressureRowView } from "@/features/overview/RulePressureRow";
import type { RulePressureSnapshot } from "@/features/overview/types";

function SubBlock({
  title,
  children,
  className,
  icon,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  icon: ReactNode;
}): ReactElement {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h3 className="inline-flex items-center gap-1.5 font-serif text-copy font-semibold text-fg">
        <span className="shrink-0 text-fg-muted" aria-hidden>
          {icon}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

export function RulePressureListsSection({
  rulePressure,
}: {
  rulePressure: RulePressureSnapshot;
}): ReactElement {
  return (
    <OverviewRegion className="gap-8 pb-8">
      <OverviewSectionHeading
        title="Rule pressure"
        icon={<Gauge className="size-4" />}
      />
      <SubBlock title="Most-failed rules" icon={<CircleX className="size-3.5" />}>
        <div className="flex flex-col">
          {rulePressure.mostFailed.map((row) => (
            <RulePressureRowView key={row.ruleId} row={row} suffix="failed" />
          ))}
        </div>
      </SubBlock>
      <SubBlock title="Most-waived rules" icon={<Scale className="size-3.5" />}>
        <div className="flex flex-col">
          {rulePressure.mostWaived.map((row) => (
            <RulePressureRowView
              key={`waived-${row.ruleId}`}
              row={row}
              suffix="waived"
            />
          ))}
        </div>
      </SubBlock>
      <RegisterLink to="/rulebook">Open the Rulebook</RegisterLink>
    </OverviewRegion>
  );
}
