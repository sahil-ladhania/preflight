/**
 * RulebookRow — one catalog table row.
 * Why: det lock vs jdg Edit link per 09 R2.
 */

import type { ReactElement } from "react";
import { Lock } from "lucide-react";

import { appliesLabel, RULEBOOK_ROW_GRID } from "@/features/rulebook/lib";
import type { RulebookRowProps } from "@/features/rulebook/types";
import { cn } from "@/lib/utils";

function KindBadge({
  kind,
}: {
  kind: RulebookRowProps["rule"]["kind"];
}): ReactElement {
  return (
    <span className="font-mono text-kind-badge uppercase text-fg-muted">
      {kind === "deterministic" ? "DET" : "JDG"}
    </span>
  );
}

export function RulebookRow({ rule, onEdit }: RulebookRowProps): ReactElement {
  return (
    <div className={cn(RULEBOOK_ROW_GRID, "border-b border-border py-1.5")}>
      <span
        className="truncate font-mono text-mono-meta text-fg"
        title={rule.ruleId}
      >
        {rule.ruleId}
      </span>
      <KindBadge kind={rule.kind} />
      <span
        className="truncate font-serif text-serif-row text-fg"
        title={rule.wording}
      >
        {rule.wording}
      </span>
      <span
        className="truncate text-ui text-fg-muted"
        title={appliesLabel(rule)}
      >
        {appliesLabel(rule)}
      </span>
      <div className="flex items-center justify-end">
        {rule.kind === "deterministic" ? (
          <span
            className="inline-flex items-center justify-center text-fg-faint"
            title="Defined in code"
          >
            <Lock className="size-[13px] shrink-0" aria-label="Defined in code" />
          </span>
        ) : (
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 text-caption text-decision underline"
            onClick={() => onEdit(rule.ruleId)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
