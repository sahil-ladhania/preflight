/**
 * StageSkeleton — static placeholder blocks for screen loading regions.
 * Why: region-shaped first-load treatment without motion (08 §13.4 #34).
 */

import type { ReactElement } from "react";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function SkeletonBlock({
  className,
}: {
  className?: string;
}): ReactElement {
  return (
    <div
      className={cn("bg-hover", className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonTableRows({
  widths,
  rows,
}: {
  widths: string[];
  rows: number;
}): ReactElement {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow
          key={rowIndex}
          className="border-b border-hairline hover:bg-transparent"
        >
          {widths.map((width, cellIndex) => (
            <TableCell key={cellIndex} className={cn("py-3", width)}>
              <SkeletonBlock className="h-3.5 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
