/**
 * RulebookTable — R2a binding + R2b advisory catalog tables.
 * Why: named sections with own column headers per 09 Screen 4.
 */

import type { ReactElement } from "react";

import type { RuleCatalogRowDTO } from "@preflight/schemas";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RulebookRow } from "@/features/rulebook/RulebookRow";
import type { RulebookTableProps } from "@/features/rulebook/types";

function SectionHeader({ label }: { label: string }): ReactElement {
  return (
    <p className="text-label-strong uppercase text-fg-muted">{label}</p>
  );
}

function RuleSection({
  header,
  rules,
  showEditColumn,
  onEdit,
}: {
  header: string;
  rules: RuleCatalogRowDTO[];
  showEditColumn: boolean;
  onEdit: (ruleId: string) => void;
}): ReactElement {
  if (rules.length === 0) {
    return <></>;
  }

  return (
    <section className="flex flex-col gap-2">
      <SectionHeader label={header} />
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
            <TableHead className="h-auto w-[220px] px-2 py-1.5 font-sans text-label font-normal uppercase text-fg-muted">
              Applies to
            </TableHead>
            <TableHead className="h-auto w-[40px] px-2 py-1.5 text-right font-sans text-label font-normal uppercase text-fg-muted">
              {showEditColumn ? "Edit" : ""}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <RulebookRow key={rule.ruleId} rule={rule} onEdit={onEdit} />
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export function RulebookTable({
  rules,
  onEdit,
}: RulebookTableProps): ReactElement {
  const binding = rules.filter((rule) => rule.kind === "deterministic");
  const advisory = rules.filter((rule) => rule.kind === "judgement");

  return (
    <div className="flex flex-col gap-12">
      <RuleSection
        header={`Binding — checked in code, cannot be edited (${binding.length})`}
        rules={binding}
        showEditColumn={false}
        onEdit={onEdit}
      />
      <RuleSection
        header={`Advisory — LLM-evaluated, editable here (${advisory.length})`}
        rules={advisory}
        showEditColumn
        onEdit={onEdit}
      />
    </div>
  );
}
