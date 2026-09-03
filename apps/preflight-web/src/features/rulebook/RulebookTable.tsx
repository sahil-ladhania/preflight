/**
 * RulebookTable — R2a binding + R2b advisory catalog tables.
 * Why: named sections with own column headers per 09 Screen 4.
 */

import type { ReactElement } from "react";

import type { RuleCatalogRowDTO } from "@preflight/schemas";

import { RULEBOOK_ROW_GRID } from "@/features/rulebook/lib";
import { RulebookRow } from "@/features/rulebook/RulebookRow";
import type { RulebookTableProps } from "@/features/rulebook/types";

function SectionHeader({ label }: { label: string }): ReactElement {
  return (
    <p className="text-label-strong uppercase text-fg-muted">{label}</p>
  );
}

function ColumnHeader({ showEdit }: { showEdit: boolean }): ReactElement {
  return (
    <div
      className={`${RULEBOOK_ROW_GRID} border-b border-fg py-1.5`}
    >
      <span className="text-label uppercase text-fg-muted">Rule</span>
      <span className="text-label uppercase text-fg-muted">Kind</span>
      <span className="text-label uppercase text-fg-muted">Wording</span>
      <span className="text-label uppercase text-fg-muted">Applies to</span>
      {showEdit ? (
        <span className="text-right text-label uppercase text-fg-muted">
          Edit
        </span>
      ) : (
        <span aria-hidden />
      )}
    </div>
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
      <ColumnHeader showEdit={showEditColumn} />
      {rules.map((rule) => (
        <RulebookRow key={rule.ruleId} rule={rule} onEdit={onEdit} />
      ))}
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
    <div className="flex flex-col gap-6">
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
