/**
 * ExceptionsSection — permanent waiver register on the landing page.
 * Why: waiver model keeps exceptions visible forever (01-problem.md).
 */

import type { ReactElement } from "react";
import { ScrollText } from "lucide-react";

import { ExceptionRow } from "@/features/overview/ExceptionRow";
import { OverviewRegion } from "@/features/overview/OverviewRegion";
import { OverviewSectionHeading } from "@/features/overview/OverviewSectionHeading";
import { RegisterLink } from "@/features/overview/RegisterLink";
import type { OverviewExceptionRow } from "@/features/overview/types";

export function ExceptionsSection({
  exceptions,
}: {
  exceptions: OverviewExceptionRow[];
}): ReactElement {
  return (
    <OverviewRegion id="exceptions" className="gap-1">
      <OverviewSectionHeading
        title="Exceptions"
        count={exceptions.length}
        icon={<ScrollText className="size-4" />}
      />
      <div className="flex flex-col">
        {exceptions.map((row) => (
          <ExceptionRow key={`${row.assetId}-${row.ruleId}`} row={row} />
        ))}
      </div>
      <RegisterLink to="/assets" className="mt-4">
        View all exceptions in Asset Register
      </RegisterLink>
    </OverviewRegion>
  );
}
