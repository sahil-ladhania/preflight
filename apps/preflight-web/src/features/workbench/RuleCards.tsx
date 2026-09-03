/**
 * RuleCards — ruleIds to catalog cards.
 * Why: rule context from explainer; handoff lives in Composer.
 */

import type { ReactElement } from "react";

import { rulesForIds } from "@/features/workbench/lib";
import type { RuleCardsProps } from "@/features/workbench/types";

function KindBadge({
  kind,
}: {
  kind: RuleCardsProps["rules"][number]["kind"];
}): ReactElement {
  return (
    <span className="rounded-md border border-border px-1.5 py-0 text-kind text-fg-muted">
      {kind === "deterministic" ? "det" : "jdg"}
    </span>
  );
}

export function RuleCard({
  rule,
}: {
  rule: RuleCardsProps["rules"][number];
}): ReactElement {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-mono text-fg-muted">{rule.ruleId}</span>
        <KindBadge kind={rule.kind} />
      </div>
      <p className="truncate text-body text-fg">{rule.wording}</p>
    </div>
  );
}

export function RuleCards({ ruleIds, rules }: RuleCardsProps): ReactElement {
  const cards = rulesForIds(rules, ruleIds);
  if (cards.length === 0) {
    return <></>;
  }

  return (
    <div className="mt-3 grid grid-cols-1 gap-3">
      {cards.map((rule) => (
        <RuleCard key={rule.ruleId} rule={rule} />
      ))}
    </div>
  );
}
