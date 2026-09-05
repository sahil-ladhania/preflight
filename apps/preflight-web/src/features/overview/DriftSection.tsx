/**
 * DriftSection — narrow-column drift diagnostic with count and statement.
 * Why: diagnostic reads like other Overview numbers, not a linked sentence fragment.
 */

import type { ReactElement } from "react";
import { GitCompareArrows } from "lucide-react";
import { Link } from "react-router-dom";

import { OverviewRegion } from "@/features/overview/OverviewRegion";
import { OverviewSectionHeading } from "@/features/overview/OverviewSectionHeading";
import { driftAssetNoun } from "@/features/overview/overview-copy";

export function DriftSection({
  driftAssetCount,
}: {
  driftAssetCount: number;
}): ReactElement {
  return (
    <OverviewRegion className="gap-3 pb-8">
      <OverviewSectionHeading
        title="Drift"
        icon={<GitCompareArrows className="size-4" />}
      />
      <div className="flex flex-col gap-2">
        <Link
          to="/rulebook"
          className="inline-flex items-baseline gap-1.5 no-underline hover:opacity-80"
        >
          <span className="font-serif text-subject-title font-semibold text-fg">
            {driftAssetCount}
          </span>
          <span className="font-sans text-ui text-fg-muted">
            {driftAssetNoun(driftAssetCount)}
          </span>
        </Link>
        <p className="max-w-prose text-ui text-fg-muted">
          Frozen ruleset no longer matches the live rulebook.
        </p>
      </div>
    </OverviewRegion>
  );
}
