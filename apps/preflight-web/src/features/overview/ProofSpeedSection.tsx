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
    <div className="flex flex-col gap-1.5">
      <span className="inline-flex items-center gap-1.5 font-sans text-label uppercase tracking-[0.04em] text-fg-muted">
        <span className="shrink-0 text-fg-muted" aria-hidden>
          {icon}
        </span>
        {label}
      </span>
      <div className="flex flex-col gap-1">
        <span className="font-serif text-subject-title font-semibold text-fg">
          {value}
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
    <section className="flex flex-col gap-8 pt-1 pb-2">
      <div className="flex flex-col gap-6">
        <OverviewSectionHeading
          title="Proof speed"
          icon={<Timer className="size-[18px]" strokeWidth={1.75} />}
          size="large"
        />
        <div className="grid gap-6 sm:grid-cols-3 sm:gap-x-10">
          <MetricBlock
            label="Median time to clear"
            value={`${proofSpeed.medianHoursToClear}h`}
            baselineDetail="Industry: 40–80h per round"
            icon={<Clock className="size-3.5" />}
          />
          <MetricBlock
            label="Regenerations per asset"
            value={proofSpeed.regenerationsPerAsset.toFixed(1)}
            baselineDetail="Industry: 2.9 rounds per asset"
            icon={<RefreshCw className="size-3.5" />}
          />
          <MetricBlock
            label="First-pass rate"
            value={`${proofSpeed.firstPassRatePercent}%`}
            baselineDetail="Industry: ~26%"
            icon={<ShieldCheck className="size-3.5" />}
          />
        </div>
      </div>
      <TimeToClearChart points={proofSpeed.weeklyMedianHours} />
    </section>
  );
}
