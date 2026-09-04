/**
 * WorkSummaryStats — Review queue metric stat line.
 * Why: numbers lead in ink, words recede per Phase 5 spec.
 * Example: 3 open · 1 held · 14 cleared.
 */

import type { ReactElement } from "react";

import type { AssetListItemDTO } from "@preflight/schemas";
import { registerCounts } from "@/features/assets/register-lib";

export function WorkSummaryStats({
  assets,
}: {
  assets: AssetListItemDTO[];
}): ReactElement {
  const counts = registerCounts(assets);

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="inline-flex items-baseline gap-1.5">
        <span className="font-serif text-subject-title font-semibold text-fg">
          {counts.needYou}
        </span>
        <span className="font-sans text-xs text-fg-muted">open</span>
      </span>
      <span className="text-xs text-fg-muted">·</span>
      <span className="inline-flex items-baseline gap-1.5">
        <span className="font-serif text-subject-title font-semibold text-fg">
          {counts.blocked}
        </span>
        <span className="font-sans text-xs text-fg-muted">held</span>
      </span>
      <span className="text-xs text-fg-muted">·</span>
      <span className="inline-flex items-baseline gap-1.5">
        <span className="font-serif text-subject-title font-semibold text-fg">
          {counts.readyToShip}
        </span>
        <span className="font-sans text-xs text-fg-muted">cleared</span>
      </span>
      {counts.pendingRules > 0 ? (
        <>
          <span className="text-xs text-fg-muted">·</span>
          <span className="font-sans text-xs text-fg-muted">
            Evaluating {counts.pendingRules} rules…
          </span>
        </>
      ) : null}
    </div>
  );
}
