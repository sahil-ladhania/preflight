/**
 * ProofSpeedSection — thesis metrics and twelve-week median chart.
 * Why: answers whether proof is getting faster with baselines beside each number.
 */

import type { ReactElement, ReactNode } from "react";
import { Clock, RefreshCw, ShieldCheck, Timer } from "lucide-react";

import { OverviewSectionHeading } from "@/features/overview/OverviewSectionHeading";
import { TimeToClearChart } from "@/features/overview/TimeToClearChart";
import type { ProofSpeedSnapshot } from "@/features/overview/types";

function MetricBlock({
  label,
  value,
  baselineDetail,
  icon,
}: {
  label: string;
  value: string;
  baselineDetail: string;
  icon: ReactNode;
}): ReactElement {
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1.5 font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
        <span className="shrink-0 text-fg-muted" aria-hidden>
          {icon}
        </span>
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
      <OverviewSectionHeading
        title="Proof speed"
        icon={<Timer className="size-4" />}
      />
      <div className="grid gap-8 sm:grid-cols-3">
        <MetricBlock
          label="Median time to clear"
          value={`${proofSpeed.medianHoursToClear}h`}
          baselineDetail="5–10 business days per round"
          icon={<Clock className="size-3.5" />}
        />
        <MetricBlock
          label="Regenerations per asset"
          value={proofSpeed.regenerationsPerAsset.toFixed(1)}
          baselineDetail="2.9 review rounds per asset"
          icon={<RefreshCw className="size-3.5" />}
        />
        <MetricBlock
          label="First-pass rate"
          value={`${proofSpeed.firstPassRatePercent}%`}
          baselineDetail="~26% cleared without a human"
          icon={<ShieldCheck className="size-3.5" />}
        />
      </div>
      <TimeToClearChart points={proofSpeed.weeklyMedianHours} />
    </section>
  );
}
