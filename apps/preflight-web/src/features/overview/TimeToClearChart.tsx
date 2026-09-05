/**
 * TimeToClearChart — twelve-week median line with readable y-scale and baseline.
 * Why: Recharts scoped to Overview; proves thesis against industry round time.
 */

import type { ReactElement } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart-tooltip";
import type { WeekClearPoint } from "@/features/overview/types";

const INDUSTRY_BASELINE_HOURS = 40;

const chartConfig = {
  medianHours: {
    label: "Median hours to clear",
    color: "var(--color-chart-line)",
  },
} satisfies ChartConfig;

function formatHours(value: number): string {
  return `${value}h`;
}

export function TimeToClearChart({
  points,
}: {
  points: WeekClearPoint[];
}): ReactElement {
  const data = points.map((point) => ({
    weekLabel: point.weekLabel,
    medianHours: point.medianHours,
  }));
  const maxHours = Math.max(
    ...points.map((point) => point.medianHours),
    INDUSTRY_BASELINE_HOURS,
  );
  const yMax = Math.ceil(maxHours / 4) * 4 + 4;

  return (
    <figure className="flex w-full flex-col gap-3">
      <figcaption className="font-sans text-label uppercase tracking-wider text-fg-muted">
        Median time to clear — last 12 weeks
      </figcaption>
      <ChartContainer config={chartConfig} className="w-full">
        <LineChart
          data={data}
          margin={{ top: 12, right: 12, bottom: 4, left: 4 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--color-chart-grid)"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="weekLabel"
            tickLine={false}
            axisLine={{ stroke: "var(--color-chart-grid)" }}
            interval={1}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={44}
            domain={[0, yMax]}
            tickFormatter={formatHours}
            tickCount={6}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--color-chart-grid)" }}
            content={
              <ChartTooltipContent valueFormatter={formatHours} />
            }
          />
          <ReferenceLine
            y={INDUSTRY_BASELINE_HOURS}
            stroke="var(--color-chart-baseline)"
            strokeDasharray="4 4"
            label={{
              value: "40h · 5 days",
              position: "insideTopRight",
              fill: "var(--color-chart-axis)",
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey="medianHours"
            stroke="var(--color-chart-line)"
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </figure>
  );
}
