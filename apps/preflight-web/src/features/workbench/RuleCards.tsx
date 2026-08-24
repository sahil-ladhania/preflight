/**
 * RuleCards — ruleIds to catalog cards.
 * Why: CTA handoff to Campaign.
 */

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
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
  onGoToCampaign,
}: {
  rule: RuleCardsProps["rules"][number];
  onGoToCampaign: () => void;
}): ReactElement {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-canvas px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-mono text-fg-muted">{rule.ruleId}</span>
        <KindBadge kind={rule.kind} />
      </div>
      <p className="truncate text-body text-fg">{rule.wording}</p>
      <Button
        type="button"
        variant="outline"
        className="h-7 w-fit rounded-md px-2 text-ui"
        onClick={onGoToCampaign}
      >
        Campaign
      </Button>
    </div>
  );
}

export function RuleCards({
  ruleIds,
  rules,
  onGoToCampaign,
}: RuleCardsProps): ReactElement {
  const cards = rulesForIds(rules, ruleIds);
  if (cards.length === 0) {
    return <></>;
  }

  return (
    <div className="mt-3 grid grid-cols-1 gap-3">
      {cards.map((rule) => (
        <RuleCard
          key={rule.ruleId}
          rule={rule}
          onGoToCampaign={onGoToCampaign}
        />
      ))}
    </div>
  );
}
