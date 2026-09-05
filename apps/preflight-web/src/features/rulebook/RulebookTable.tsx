/**
 * RulebookTable — R2a binding + R2b advisory catalog tables.
 * Why: named sections with own column headers per 09 Screen 4.
 */

import type { ReactElement, ReactNode } from "react";
import { Cpu, Scale } from "lucide-react";

import type { RuleCatalogRowDTO } from "@preflight/schemas";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RulebookRow } from "@/features/rulebook/RulebookRow";
import type { RulebookTableProps } from "@/features/rulebook/types";
import { OverviewSectionHeading } from "@/features/overview/OverviewSectionHeading";

function SectionHeading({
  title,
  count,
  description,
  icon,
}: {
  title: string;
  count: number;
  description: string;
  icon: ReactNode;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1 pb-1">
      <OverviewSectionHeading title={title} count={count} icon={icon} />
      <p className="font-sans text-xs text-fg-muted">{description}</p>
    </div>
  );
}

function TablePagination(): ReactElement {
  return (
    <Pagination className="justify-start pt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext disabled />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function RuleSection({
  title,
  description,
  icon,
  rules,
  showEditColumn,
  onEdit,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  rules: RuleCatalogRowDTO[];
  showEditColumn: boolean;
  onEdit: (ruleId: string) => void;
}): ReactElement {
  if (rules.length === 0) {
    return (
      <section className="flex flex-col gap-2">
        <SectionHeading
          title={title}
          count={0}
          description={description}
          icon={icon}
        />
        <p className="py-6 font-sans text-xs text-fg-muted">No matching rules.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <SectionHeading
        title={title}
        count={rules.length}
        description={description}
        icon={icon}
      />
      <Table className="w-full table-fixed">
        <TableHeader className="[&_tr]:border-b-fg">
          <TableRow className="border-b border-fg hover:bg-transparent">
            <TableHead className="h-auto w-[100px] px-2 py-1.5 font-sans text-label font-normal uppercase text-fg-muted">
              Rule
            </TableHead>
            <TableHead className="h-auto w-[60px] px-2 py-1.5 font-sans text-label font-normal uppercase text-fg-muted">
              Kind
            </TableHead>
            <TableHead className="h-auto px-2 py-1.5 font-sans text-label font-normal uppercase text-fg-muted">
              Wording
            </TableHead>
            <TableHead className="h-auto w-[260px] px-2 py-1.5 font-sans text-label font-normal uppercase text-fg-muted">
              Applies to
            </TableHead>
            <TableHead className="h-auto w-[56px] px-2 py-1.5 text-right font-sans text-label font-normal uppercase text-fg-muted">
              {showEditColumn ? "Edit" : ""}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-6 text-center text-caption text-fg-muted"
              >
                No matching rules
              </TableCell>
            </TableRow>
          ) : (
            rules.map((rule) => (
              <RulebookRow key={rule.ruleId} rule={rule} onEdit={onEdit} />
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination />
    </section>
  );
}

export function RulebookTable({
  rules,
  onEdit,
}: RulebookTableProps): ReactElement {
  const hard = rules.filter((rule) => rule.kind === "deterministic");
  const judgement = rules.filter((rule) => rule.kind === "judgement");

  return (
    <div className="flex flex-col gap-12">
      <RuleSection
        title="Hard rules"
        description="Checked automatically on every asset. These can stop something shipping. Not editable."
        icon={<Cpu className="size-4" />}
        rules={hard}
        showEditColumn={false}
        onEdit={onEdit}
      />
      <RuleSection
        title="Judgement rules"
        description="Reviewed case by case, then a person decides. You can edit these."
        icon={<Scale className="size-4" />}
        rules={judgement}
        showEditColumn
        onEdit={onEdit}
      />
    </div>
  );
}
