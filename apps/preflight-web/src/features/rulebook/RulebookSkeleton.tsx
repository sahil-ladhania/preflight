/**
 * RulebookSkeleton — Screen 4 catalog loading placeholder.
 * Why: two-section table layout during fetch (09 Screen 4, 08 §13.4 #34).
 */

import type { ReactElement } from "react";
import { Cpu, Scale } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OverviewSectionHeading } from "@/features/overview/OverviewSectionHeading";
import {
  SkeletonTableRows,
} from "@/features/shell/StageSkeleton";

const RULE_ROW_WIDTHS = [
  "w-[100px]",
  "w-[60px]",
  "min-w-0",
  "w-[260px]",
  "w-[56px]",
];

function RuleSectionSkeleton({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactElement;
}): ReactElement {
  return (
    <section className="flex flex-col gap-2" aria-hidden="true">
      <div className="flex flex-col gap-1 pb-1">
        <OverviewSectionHeading title={title} count={0} icon={icon} />
        <p className="font-sans text-xs text-fg-muted">{description}</p>
      </div>
      <Table className="w-full table-fixed">
        <TableHeader className="[&_tr]:border-b-fg">
          <TableRow className="border-b border-fg hover:bg-transparent">
            <TableHead className="h-auto w-[100px] px-3 py-2 font-sans text-label font-normal uppercase text-fg-muted">
              Rule
            </TableHead>
            <TableHead className="h-auto w-[60px] px-3 py-2 font-sans text-label font-normal uppercase text-fg-muted">
              Kind
            </TableHead>
            <TableHead className="h-auto px-3 py-2 font-sans text-label font-normal uppercase text-fg-muted">
              Wording
            </TableHead>
            <TableHead className="h-auto w-[260px] px-3 py-2 font-sans text-label font-normal uppercase text-fg-muted">
              Applies to
            </TableHead>
            <TableHead className="h-auto w-[56px] px-3 py-2 text-right font-sans text-label font-normal uppercase text-fg-muted" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <SkeletonTableRows widths={RULE_ROW_WIDTHS} rows={4} />
        </TableBody>
      </Table>
    </section>
  );
}

export function RulebookSkeleton(): ReactElement {
  return (
    <div
      className="flex flex-col gap-12"
      aria-busy="true"
      aria-label="Loading rules"
    >
      <RuleSectionSkeleton
        title="Hard rules"
        description="Checked automatically on every asset. These can stop something shipping. Not editable."
        icon={<Cpu className="size-4" />}
      />
      <RuleSectionSkeleton
        title="Judgement rules"
        description="Reviewed case by case, then a person decides. You can edit these."
        icon={<Scale className="size-4" />}
      />
    </div>
  );
}
