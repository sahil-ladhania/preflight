/**
 * WorkSummaryStats — Review queue metric stat line.
 * Why: numbers lead in ink, words recede per Phase 5 spec.
 * Example: 3 open · 1 held · 14 cleared.
 */

import type { ReactElement, ReactNode } from "react";
import { Inbox, Loader2, Octagon, ShieldCheck } from "lucide-react";

import type { AssetListItemDTO } from "@preflight/schemas";
import { registerCounts } from "@/features/assets/register-lib";

function StatCount({
  value,
  label,
  icon,
}: {
  value: number;
  label: string;
  icon: ReactNode;
}): ReactElement {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="shrink-0 text-fg-muted" aria-hidden>
        {icon}
      </span>
      <span className="font-serif text-subject-title font-semibold text-fg">
        {value}
      </span>
      <span className="font-sans text-xs text-fg-muted">{label}</span>
    </span>
  );
}

export function WorkSummaryStats({
  assets,
}: {
  assets: AssetListItemDTO[];
}): ReactElement {
  const counts = registerCounts(assets);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <StatCount
        value={counts.needYou}
        label="open"
        icon={<Inbox className="size-3.5" />}
      />
      <span className="text-xs text-fg-muted">·</span>
      <StatCount
        value={counts.blocked}
        label="held"
        icon={<Octagon className="size-3.5" />}
      />
      <span className="text-xs text-fg-muted">·</span>
      <StatCount
        value={counts.readyToShip}
        label="cleared"
        icon={<ShieldCheck className="size-3.5" />}
      />
      {counts.pendingRules > 0 ? (
        <>
          <span className="text-xs text-fg-muted">·</span>
          <span className="inline-flex items-center gap-1.5 font-sans text-xs text-fg-muted">
            <Loader2
              className="size-3 shrink-0 animate-spin text-fg-muted"
              aria-hidden="true"
            />
            Evaluating {counts.pendingRules} rules…
          </span>
        </>
      ) : null}
    </div>
  );
}
