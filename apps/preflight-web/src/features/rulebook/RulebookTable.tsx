/**
 * RulebookTable — R2 merged catalog table.
 * Why: sticky header + dense row grid.
 */

import type { ReactElement } from "react";

import { RulebookRow } from "@/features/rulebook/RulebookRow";
import type { RulebookTableProps } from "@/features/rulebook/types";

function TableHeader(): ReactElement {
  return (
    <div className="sticky top-0 grid grid-cols-[140px_56px_minmax(0,1fr)_160px_100px] items-center gap-4 border-b border-border bg-canvas-subtle px-4 py-2">
      <span className="text-caption text-fg-muted">id</span>
      <span className="text-caption text-fg-muted">kind</span>
      <span className="text-caption text-fg-muted">Wording</span>
      <span className="text-caption text-fg-muted">Applies</span>
      <span className="text-caption text-fg-muted">Act</span>
    </div>
  );
}

export function RulebookTable({
  rules,
  onEdit,
  onDelete,
}: RulebookTableProps): ReactElement {
  return (
    <div className="flex flex-col">
      <TableHeader />
      {rules.map((rule) => (
        <RulebookRow
          key={rule.ruleId}
          rule={rule}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
