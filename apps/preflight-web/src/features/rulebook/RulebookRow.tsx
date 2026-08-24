/**
 * RulebookRow — one catalog table row.
 * Why: det lock vs jdg Edit/Delete actions.
 */

import type { ReactElement } from "react";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { appliesLabel } from "@/features/rulebook/lib";
import type { RulebookRowProps } from "@/features/rulebook/types";

function KindBadge({
  kind,
}: {
  kind: RulebookRowProps["rule"]["kind"];
}): ReactElement {
  return (
    <span className="rounded-md border border-border px-1.5 py-0 text-kind text-fg-muted">
      {kind === "deterministic" ? "det" : "jdg"}
    </span>
  );
}

export function RulebookRow({
  rule,
  onEdit,
  onDelete,
}: RulebookRowProps): ReactElement {
  return (
    <div className="grid grid-cols-[140px_56px_minmax(0,1fr)_160px_100px] items-center gap-4 border-b border-border bg-canvas px-4 py-2">
      <span className="truncate text-mono text-fg-muted">{rule.ruleId}</span>
      <KindBadge kind={rule.kind} />
      <span className="truncate text-body text-fg">{rule.wording}</span>
      <span className="truncate text-caption text-fg-muted">
        {appliesLabel(rule)}
      </span>
      <div className="flex items-center gap-2">
        {rule.kind === "deterministic" ? (
          <span className="flex items-center gap-1 text-caption text-fg-muted">
            <Lock className="size-3 shrink-0" aria-hidden />
            Defined in code
          </span>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              className="h-7 rounded-md px-2 text-ui"
              onClick={() => onEdit(rule.ruleId)}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-7 rounded-md px-2 text-ui"
              onClick={() => onDelete(rule.ruleId)}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
