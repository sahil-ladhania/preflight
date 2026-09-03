/**
 * ConstraintCards — R2 frozen constraint cards.
 * Why: zero-rules banner and acknowledge checkbox.
 */

import type { ReactElement } from "react";
import { Loader2 } from "lucide-react";

import type { CompileRuleCardDTO } from "@preflight/schemas";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ConstraintCardsProps } from "@/features/campaign/types";

function KindBadge({ kind }: { kind: CompileRuleCardDTO["kind"] }): ReactElement {
  return (
    <span className="rounded-md border border-border px-1.5 py-0 text-kind text-fg-muted">
      {kind === "deterministic" ? "det" : "jdg"}
    </span>
  );
}

function ConstraintCard({ rule }: { rule: CompileRuleCardDTO }): ReactElement {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        <span className="text-mono text-fg-muted">{rule.ruleId}</span>
        <KindBadge kind={rule.kind} />
      </div>
      <p className="text-body text-fg">{rule.wording}</p>
      <p className="text-caption text-fg-muted">{rule.applicabilityReason}</p>
    </div>
  );
}

export function ConstraintCards({
  compileResult,
  compileInFlight,
  compileDisabled,
  emptySetAcknowledged,
  staleBanner,
  onCompile,
  onEmptySetAckChange,
}: ConstraintCardsProps): ReactElement {
  const showZeroRules =
    compileResult !== null && compileResult.ruleIds.length === 0;

  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        variant="outline"
        className="h-8 w-fit rounded-md px-4"
        disabled={compileDisabled || compileInFlight}
        onClick={onCompile}
      >
        {compileInFlight ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          "Freeze"
        )}
      </Button>
      {staleBanner ? (
        <p className="text-caption text-fg-muted">
          Brief changed — recompile to refresh constraints.
        </p>
      ) : null}
      {compileResult !== null && compileResult.rules.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 min-[720px]:grid-cols-2">
          {compileResult.rules.map((rule) => (
            <ConstraintCard key={rule.ruleId} rule={rule} />
          ))}
        </div>
      ) : null}
      {showZeroRules ? (
        <div className="flex flex-col gap-3 rounded-md border border-border bg-surface px-4 py-3">
          <p className="text-body text-fg">No rules apply to this brief.</p>
          <label className="flex cursor-pointer items-center gap-2 text-body text-fg">
            <Checkbox
              checked={emptySetAcknowledged}
              onCheckedChange={(checked) =>
                onEmptySetAckChange(checked === true)
              }
            />
            I intend an empty constraint set
          </label>
        </div>
      ) : null}
    </div>
  );
}
