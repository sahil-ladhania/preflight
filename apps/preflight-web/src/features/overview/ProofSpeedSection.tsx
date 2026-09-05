/**
 * ProofSpeedSection — thesis metrics and twelve-week median chart.
 * Why: answers whether proof is getting faster with baselines beside each number.
 */

import type { ReactElement } from "react";

import { OverviewSectionHeading } from "@/features/overview/OverviewSectionHeading";
import { TimeToClearChart } from "@/features/overview/TimeToClearChart";
import type { ProofSpeedSnapshot } from "@/features/overview/types";

function MetricBlock({
  label,
  value,
  baselineDetail,
}: {
  label: string;
  value: string;
  baselineDetail: string;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
        {label}
      </span>
      <span className="font-serif text-subject-title font-semibold text-fg">
        {value}
      </span>
      <div className="mt-2 flex flex-col gap-0.5">
        <span className="font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
          Industry baseline
        </span>
        <span className="font-sans text-caption text-fg-muted">
          {baselineDetail}
        </span>
      </div>
    </div>
  );
}

export function ProofSpeedSection({
  proofSpeed,
}: {
  proofSpeed: ProofSpeedSnapshot;
}): ReactElement {
  return (
    <section className="flex flex-col gap-10 py-2">
      <OverviewSectionHeading title="Proof speed" />
      <div className="grid gap-8 sm:grid-cols-3">
        <MetricBlock
          label="Median time to clear"
          value={`${proofSpeed.medianHoursToClear}h`}
          baselineDetail="5–10 business days per round"
        />
        <MetricBlock
          label="Regenerations per asset"
          value={proofSpeed.regenerationsPerAsset.toFixed(1)}
          baselineDetail="2.9 review rounds per asset"
        />
        <MetricBlock
          label="First-pass rate"
          value={`${proofSpeed.firstPassRatePercent}%`}
          baselineDetail="~26% cleared without a human"
        />
      </div>
      <TimeToClearChart points={proofSpeed.weeklyMedianHours} />
    </section>
  );
}
