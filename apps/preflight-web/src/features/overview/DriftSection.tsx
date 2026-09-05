/**
 * DriftSection — narrow-column drift diagnostic with count and statement.
 * Why: diagnostic reads like other Overview numbers, not a linked sentence fragment.
 */

import type { ReactElement } from "react";
import { GitCompareArrows } from "lucide-react";

import { OverviewRegion } from "@/features/overview/OverviewRegion";
import { OverviewSectionHeading } from "@/features/overview/OverviewSectionHeading";
import { driftAssetNoun } from "@/features/overview/overview-copy";
import { RegisterLink } from "@/features/overview/RegisterLink";

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
        <div className="inline-flex items-baseline gap-1.5">
          <span className="font-serif text-subject-title font-semibold text-fg">
            {driftAssetCount}
          </span>
          <span className="font-sans text-ui text-fg-muted">
            {driftAssetNoun(driftAssetCount)}
          </span>
        </div>
        <p className="max-w-prose text-ui text-fg-muted">
          Frozen ruleset no longer matches the live rulebook.
        </p>
      </div>
      <RegisterLink to="/rulebook">Open the Rulebook</RegisterLink>
    </OverviewRegion>
  );
}
