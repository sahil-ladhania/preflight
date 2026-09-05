/**
 * RegisterSkeleton — Screen 2 table-region loading placeholder.
 * Why: preserve register layout during fetch (09 Screen 2, 08 §13.4 #34).
 */

import type { ReactElement } from "react";

import {
  Table,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { ColumnHeaderRow } from "@/features/assets/AssetsRegisterTable";
import {
  SkeletonBlock,
  SkeletonTableRows,
} from "@/features/shell/StageSkeleton";

function RegisterToolbarSpacer(): ReactElement {
  return (
    <div
      className="my-4 border-b border-[var(--color-chrome-bottom)]/15 pb-3"
      aria-hidden="true"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap gap-6">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-4 w-12" />
          <SkeletonBlock className="h-4 w-20" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SkeletonBlock className="h-8 w-40" />
          <SkeletonBlock className="h-8 w-36" />
          <SkeletonBlock className="h-8 w-32" />
          <SkeletonBlock className="h-8 w-32" />
        </div>
      </div>
    </div>
  );
}

const REGISTER_ROW_WIDTHS = [
  "w-[120px]",
  "min-w-[180px]",
  "w-[140px]",
  "min-w-[200px]",
  "w-[150px]",
  "w-[110px]",
];

export function RegisterSkeleton(): ReactElement {
  return (
    <div aria-busy="true" aria-label="Loading assets">
      <RegisterToolbarSpacer />
      <Table>
        <TableHeader>
          <ColumnHeaderRow />
        </TableHeader>
        <TableBody>
          <SkeletonTableRows widths={REGISTER_ROW_WIDTHS} rows={6} />
        </TableBody>
      </Table>
    </div>
  );
}
