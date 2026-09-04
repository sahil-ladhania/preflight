/**
 * LoginPattern — ledger-grid texture for the dark login brand panel.
 * Why: paper/record motif at low opacity over the gradient ground (08 §3.6).
 */

import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

const VIEW_W = 1200;
const VIEW_H = 1600;

function gridRows(start: number, end: number, step: number): number[] {
  const rows: number[] = [];
  for (let y = start; y <= end; y += step) {
    rows.push(y);
  }
  return rows;
}

const QUIET_ROWS = gridRows(64, 560, 40);
const DENSE_ROWS = gridRows(592, VIEW_H, 32);
const V_STOPS = [110, 280, 450, 620, 790, 960];

function RegisterGrid(): ReactElement {
  const vPath = V_STOPS.map((x) => `M${x} 0V${VIEW_H}`).join("");

  return (
    <>
      <g stroke="#c7c0b0" strokeOpacity="0.12">
        {QUIET_ROWS.map((y) => (
          <path key={`q-${y}`} d={`M0 ${y}H${VIEW_W}`} />
        ))}
        {DENSE_ROWS.map((y) => (
          <path key={`d-${y}`} d={`M0 ${y}H${VIEW_W}`} />
        ))}
        <path d={vPath} strokeOpacity="0.08" />
      </g>

      <g fill="#c7c0b0" fillOpacity="0.06">
        {V_STOPS.map((x, i) => (
          <rect key={x} x={x - 3} y={200 + i * 80} width="3" height={VIEW_H - 200 - i * 80} />
        ))}
      </g>
    </>
  );
}

export interface LoginPatternProps {
  className?: string;
}

export function LoginPattern({ className }: LoginPatternProps): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMinYMid slice"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      <RegisterGrid />
    </svg>
  );
}
