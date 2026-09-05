/**
 * chart — shadcn ChartContainer for Overview proof-speed line chart.
 * Why: Recharts wrapper scoped to product tokens; styled down per 08 §13 #26.
 */

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function ChartStyle({
  id,
  config,
}: {
  id: string;
  config: ChartConfig;
}): React.ReactElement | null {
  const entries = Object.entries(config).filter(([, item]) => item.color);
  if (entries.length === 0) {
    return null;
  }

  const rules = entries
    .map(([key, item]) =>
      item.color ? `  --color-${key}: ${item.color};` : "",
    )
    .join("\n");

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-chart=${id}] {\n${rules}\n}`,
      }}
    />
  );
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}): React.ReactElement {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "relative h-[260px] w-full text-xs [&_.recharts-cartesian-axis-tick_text]:fill-[var(--color-chart-axis)] [&_.recharts-cartesian-axis-tick_text]:font-mono [&_.recharts-cartesian-axis-tick_text]:text-[11px] [&_.recharts-cartesian-grid_line]:stroke-[var(--color-chart-grid)] [&_.recharts-layer]:outline-hidden [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          width="100%"
          height="100%"
          minHeight={260}
          initialDimension={{ width: 600, height: 260 }}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}
