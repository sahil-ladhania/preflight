/**
 * StateLine — operation-wide summary counts in PageHeader supporting slot.
 * Why: register stat line pattern at whole-operation scale (08 §8.1).
 */

import type { ReactElement } from "react";

import type { OverviewStateCounts } from "@/features/overview/lib";
import {
  stateLineCampaignsInProgress,
  stateLineNeedHuman,
  stateLineShippedException,
} from "@/features/overview/overview-copy";

function StatCount({
  value,
  label,
  href,
}: {
  value: number;
  label: string;
  href?: string;
}): ReactElement {
  const inner = (
    <>
      <span className="font-serif text-subject-title font-semibold text-fg">
        {value}
      </span>{" "}
      <span className="font-sans text-xs text-fg-muted">{label}</span>
    </>
  );

  if (href === undefined) {
    return <span className="inline-flex items-baseline gap-1.5">{inner}</span>;
  }

  return (
    <a
      href={href}
      className="inline-flex items-baseline gap-1.5 no-underline hover:opacity-80"
    >
      {inner}
    </a>
  );
}

export function StateLine({
  counts,
}: {
  counts: OverviewStateCounts;
}): ReactElement {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <StatCount
        value={counts.needHuman}
        label={stateLineNeedHuman(counts.needHuman)}
        href="#needs-you"
      />
      <span className="text-xs text-fg-muted">·</span>
      <StatCount
        value={counts.withException}
        label={stateLineShippedException(counts.withException)}
        href="#exceptions"
      />
      <span className="text-xs text-fg-muted">·</span>
      <StatCount
        value={counts.campaignsInProgress}
        label={stateLineCampaignsInProgress(counts.campaignsInProgress)}
      />
    </div>
  );
}
