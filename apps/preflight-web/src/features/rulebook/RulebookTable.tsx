/**
 * RulebookTable — R2 merged catalog table.
 * Why: sticky header + dense row grid with det/jdg grouping.
 */

import type { ReactElement } from "react";

import { RulebookRow } from "@/features/rulebook/RulebookRow";
import type { RulebookTableProps } from "@/features/rulebook/types";

const GRID =
  "grid grid-cols-[180px_56px_minmax(0,1fr)_200px_72px] items-center gap-4";

function TableHeader(): ReactElement {
  return (
    <div
      className={`sticky top-0 ${GRID} border-b border-border bg-canvas-subtle px-4 py-2`}
    >
      <span className="text-caption text-fg-muted">id</span>
      <span className="text-caption text-fg-muted">kind</span>
      <span className="text-caption text-fg-muted">Wording</span>
      <span className="text-caption text-fg-muted">Applies</span>
      <span className="text-caption text-fg-muted">Act</span>
    </div>
  );
}

function SectionDivider({ label }: { label: string }): ReactElement {
  return (
    <div className="border-y border-border bg-canvas-subtle px-4 py-1.5">
      <span className="text-caption text-fg-muted">{label}</span>
    </div>
  );
}

export function RulebookTable({
  rules,
  onEdit,
  onDelete,
}: RulebookTableProps): ReactElement {
  return (
    <div className="flex flex-col bg-canvas">
      <TableHeader />
      {rules.map((rule, index) => {
        const previous = index > 0 ? rules[index - 1] : null;
        const showJudgementDivider =
          previous?.kind === "deterministic" && rule.kind === "judgement";

        return (
          <div key={rule.ruleId}>
            {showJudgementDivider ? (
              <SectionDivider label="Judgement rules" />
            ) : null}
            <RulebookRow rule={rule} onEdit={onEdit} onDelete={onDelete} />
          </div>
        );
      })}
    </div>
  );
}
