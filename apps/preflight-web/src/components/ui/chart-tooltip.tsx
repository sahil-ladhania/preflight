/**
 * chart-tooltip — squared Recharts tooltip for Overview proof-speed chart.
 * Why: hover values without default Recharts chrome (08 §13 #27).
 */

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export function ChartTooltip({
  ...props
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip>): React.ReactElement {
  return (
    <RechartsPrimitive.Tooltip isAnimationActive={false} {...props} />
  );
}

type ChartTooltipContentProps = React.ComponentProps<"div"> & {
  active?: boolean;
  payload?: ReadonlyArray<{
    value?: number | string;
    dataKey?: string | number;
  }>;
  label?: string | number;
  valueFormatter?: (value: number) => string;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  valueFormatter,
  ...props
}: ChartTooltipContentProps): React.ReactElement | null {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }

  const rawValue = payload[0]?.value;
  const numericValue =
    typeof rawValue === "number" ? rawValue : Number(rawValue ?? 0);
  const formattedValue = valueFormatter
    ? valueFormatter(numericValue)
    : String(rawValue ?? "");

  return (
    <div
      className={cn(
        "border border-hairline bg-paper px-3 py-2 shadow-none rounded-none",
        className,
      )}
      {...props}
    >
      <p className="font-sans text-caption text-fg-muted">{label}</p>
      <p className="font-mono text-mono-meta text-fg">{formattedValue}</p>
    </div>
  );
}
