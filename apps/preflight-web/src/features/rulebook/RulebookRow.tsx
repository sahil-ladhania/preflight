/**
 * RulebookRow — one catalog table row.
 * Why: det lock vs jdg icon Edit/Delete actions.
 */

import type { ReactElement } from "react";
import { Lock, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatGeneratedAt } from "@/features/assets/lib";
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

function lastChangeCaption(
  rule: RulebookRowProps["rule"],
): string | null {
  if (rule.lastChange === null) {
    return null;
  }

  const prefix =
    rule.lastChange.action === "create" ? "Created by" : "Last changed by";
  return `${prefix} ${rule.lastChange.actor} · ${formatGeneratedAt(rule.lastChange.at)}`;
}

export function RulebookRow({
  rule,
  onEdit,
  onDelete,
}: RulebookRowProps): ReactElement {
  const changeCaption = lastChangeCaption(rule);

  return (
    <div
      className={cn(
        RULEBOOK_ROW_GRID,
        "border-b border-border bg-surface px-4 py-2 hover:bg-ground",
      )}
    >
      <span className="truncate text-mono text-fg-muted" title={rule.ruleId}>
        {rule.ruleId}
      </span>
      <KindBadge kind={rule.kind} />
      <div className="min-w-0">
        <span className="block truncate font-serif text-body text-fg" title={rule.wording}>
          {rule.wording}
        </span>
        {changeCaption !== null ? (
          <span className="block truncate text-caption text-fg-muted">
            {changeCaption}
          </span>
        ) : null}
      </div>
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
              className="text-fail hover:bg-fail-wash hover:text-fail"
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
