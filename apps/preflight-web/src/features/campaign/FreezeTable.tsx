/**
 * FreezeTable — S3 inspectable compiled ruleset table.
 * Why: freeze is a table like Rulebook, not tinted cards (09 Screen 3).
 */

import type { ReactElement } from "react";

import type { CompileResponseDTO, CompileRuleCardDTO } from "@preflight/schemas";

import { Checkbox } from "@/components/ui/checkbox";
import { shortHash } from "@/features/campaign/lib";
import { cn } from "@/lib/utils";

export interface FreezeTableProps {
  compileResult: CompileResponseDTO | null;
  emptySetAcknowledged: boolean;
  staleBanner: boolean;
  showAcknowledgement: boolean;
  onEmptySetAckChange: (checked: boolean) => void;
}

function kindLabel(kind: CompileRuleCardDTO["kind"]): string {
  return kind === "deterministic" ? "DET" : "JDG";
}

function RuleRow({ rule }: { rule: CompileRuleCardDTO }): ReactElement {
  return (
    <div className="grid grid-cols-[90px_36px_minmax(0,1fr)] items-baseline gap-4 border-b border-hairline py-3">
      <span className="font-mono text-mono-meta text-fg">{rule.ruleId}</span>
      <span className="font-mono text-kind-badge font-normal uppercase text-fg-muted">
        {kindLabel(rule.kind)}
      </span>
      <div className="flex min-w-0 max-w-2xl flex-col gap-1">
        <p className="font-serif text-serif-row text-fg">{rule.wording}</p>
        {/* The server sends the whole sentence ("Applies because …"); a client
            prefix here would double it. */}
        <p className="text-caption text-fg-muted">{rule.applicabilityReason}</p>
      </div>
    </div>
  );
}

export function FreezeTable({
  compileResult,
  emptySetAcknowledged,
  staleBanner,
  showAcknowledgement,
  onEmptySetAckChange,
}: FreezeTableProps): ReactElement {
  const ruleCount = compileResult?.ruleIds.length ?? 0;
  const hash = compileResult?.rulesetHash ?? "";

  return (
    <div className="flex flex-col gap-4">
      {staleBanner ? (
        <p className="text-caption text-fg-muted">
          Brief changed — freeze again to refresh the rules.
        </p>
      ) : null}
      {compileResult !== null ? (
        <>
          <div className="flex items-center justify-between border border-fg px-[18px] py-[14px]">
            <span className="text-ui-strong text-fg">
              Compiled ruleset — {ruleCount} rule{ruleCount === 1 ? "" : "s"} pinned
            </span>
            <span className="font-mono text-mono-meta text-fg-muted">
              {shortHash(hash)}
            </span>
          </div>
          <div className="flex flex-col">
            {compileResult.rules.map((rule) => (
              <RuleRow key={rule.ruleId} rule={rule} />
            ))}
          </div>
        </>
      ) : null}
      {showAcknowledgement ? (
        <div className={cn("flex flex-col gap-3 border border-hairline p-4")}>
          <p className="text-ui text-fg">No rules apply to this brief.</p>
          <label className="flex cursor-pointer items-start gap-2 text-ui text-fg">
            <Checkbox
              checked={emptySetAcknowledged}
              onCheckedChange={(checked) => {
                onEmptySetAckChange(checked === true);
              }}
            />
            <span>
              No compliance rules apply to this brief — I acknowledge generating
              with an empty constraint set.
            </span>
          </label>
        </div>
      ) : null}
    </div>
  );
}
