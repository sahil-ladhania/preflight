/**
 * RulebookRow — one catalog table row.
 * Why: det lock vs jdg icon Edit/Delete actions.
 */

import type { ReactElement } from "react";
import { Lock, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { appliesLabel, RULEBOOK_ROW_GRID } from "@/features/rulebook/lib";
import type { RulebookRowProps } from "@/features/rulebook/types";
import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        RULEBOOK_ROW_GRID,
        "border-b border-border bg-canvas px-4 py-2 hover:bg-canvas-subtle",
      )}
    >
      <span className="truncate text-mono text-fg-muted" title={rule.ruleId}>
        {rule.ruleId}
      </span>
      <KindBadge kind={rule.kind} />
      <span className="truncate text-body text-fg" title={rule.wording}>
        {rule.wording}
      </span>
      <span className="truncate text-caption text-fg-muted" title={appliesLabel(rule)}>
        {appliesLabel(rule)}
      </span>
      <div className="flex min-w-[80px] items-center justify-end gap-1">
        {rule.kind === "deterministic" ? (
          <span
            className="inline-flex size-7 items-center justify-center text-fg-muted"
            title="Defined in code"
          >
            <Lock className="size-3.5 shrink-0" aria-label="Defined in code" />
          </span>
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Edit rule"
              onClick={() => onEdit(rule.ruleId)}
            >
              <Pencil aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Delete rule"
              className="text-fail hover:bg-fail-fill hover:text-fail"
              onClick={() => onDelete(rule.ruleId)}
            >
              <Trash2 aria-hidden />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
