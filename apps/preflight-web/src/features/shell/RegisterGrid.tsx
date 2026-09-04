/**
 * RegisterGrid — shared ledger-grid SVG pattern for Login and Workbench.
 * Why: single implementation for paper/record grid motif across routes (08 §3.6).
 */

import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

export const REGISTER_GRID_W = 1200;
export const REGISTER_GRID_H = 1600;

function gridRows(start: number, end: number, step: number): number[] {
  const rows: number[] = [];
  for (let y = start; y <= end; y += step) {
    rows.push(y);
  }
  return rows;
}

const QUIET_ROWS = gridRows(64, 560, 40);
const DENSE_ROWS = gridRows(592, REGISTER_GRID_H, 32);
const V_STOPS = [110, 280, 450, 620, 790, 960];

export interface RegisterGridProps {
  stroke?: string;
  strokeOpacity?: number | string;
  vStrokeOpacity?: number | string;
  fill?: string;
  fillOpacity?: number | string;
  className?: string;
}

export function RegisterGrid({
  stroke = "#c7c0b0",
  strokeOpacity = 0.12,
  vStrokeOpacity = 0.08,
  fill = "#c7c0b0",
  fillOpacity = 0.06,
  className,
}: RegisterGridProps): ReactElement {
  const vPath = V_STOPS.map((x) => `M${x} 0V${REGISTER_GRID_H}`).join("");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${REGISTER_GRID_W} ${REGISTER_GRID_H}`}
      preserveAspectRatio="xMinYMid slice"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      <g stroke={stroke} strokeOpacity={strokeOpacity}>
        {QUIET_ROWS.map((y) => (
          <path key={`q-${y}`} d={`M0 ${y}H${REGISTER_GRID_W}`} />
        ))}
        {DENSE_ROWS.map((y) => (
          <path key={`d-${y}`} d={`M0 ${y}H${REGISTER_GRID_W}`} />
        ))}
        <path d={vPath} strokeOpacity={vStrokeOpacity} />
      </g>

      <g fill={fill} fillOpacity={fillOpacity}>
        {V_STOPS.map((x, i) => (
          <rect
            key={x}
            x={x - 3}
            y={200 + i * 80}
            width="3"
            height={REGISTER_GRID_H - 200 - i * 80}
          />
        ))}
      </g>
    </svg>
  );
}
