/**
 * LoginPattern — static register texture for the login brand panel.
 * Why: layered ledger motif with quiet top for logo overlay (08 tokens).
 */

import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

const QUIET_TOP_END = 560;
const VIEW_W = 1200;
const VIEW_H = 1600;

function quietRowYs(): number[] {
  const rows: number[] = [];
  for (let y = 64; y <= QUIET_TOP_END; y += 40) {
    rows.push(y);
  }
  return rows;
}

function richRowYs(): number[] {
  const rows: number[] = [];
  for (let y = QUIET_TOP_END + 32; y <= VIEW_H; y += 32) {
    rows.push(y);
  }
  return rows;
}

function RegisterPatternSvg(): ReactElement {
  const quietRows = quietRowYs();
  const richRows = richRowYs();

  return (
    <>
      <rect width={VIEW_W} height={VIEW_H} fill="#f6f4ee" />
      <rect width={VIEW_W} height={VIEW_H} fill="#eef1f4" fillOpacity="0.45" />

      <g stroke="#c7c0b0" strokeOpacity="0.26">
        {quietRows.map((y) => (
          <path key={`quiet-${y}`} d={`M0 ${y}H${VIEW_W}`} />
        ))}
        <path
          d={`M110 0V${QUIET_TOP_END}M280 0V${QUIET_TOP_END}M450 0V${QUIET_TOP_END}M620 0V${QUIET_TOP_END}M790 0V${QUIET_TOP_END}M960 0V${QUIET_TOP_END}`}
          strokeOpacity="0.14"
        />
      </g>

      <g fill="#2c4257" fillOpacity="0.05">
        <rect x="277" y="120" width="3" height="280" />
        <rect x="617" y="200" width="3" height="240" />
      </g>

      <g stroke="#c7c0b0" strokeOpacity="0.35">
        {richRows.map((y) => (
          <path key={`rich-${y}`} d={`M0 ${y}H${VIEW_W}`} />
        ))}
        <path
          d={`M110 0V${VIEW_H}M280 0V${VIEW_H}M450 0V${VIEW_H}M620 0V${VIEW_H}M790 0V${VIEW_H}M960 0V${VIEW_H}`}
          strokeOpacity="0.18"
        />
      </g>

      <g fill="#2c4257" fillOpacity="0.08">
        <rect x="107" y={QUIET_TOP_END + 80} width="3" height={VIEW_H - QUIET_TOP_END - 80} />
        <rect x="277" y={QUIET_TOP_END + 160} width="3" height={VIEW_H - QUIET_TOP_END - 160} />
        <rect x="447" y={QUIET_TOP_END + 40} width="3" height={VIEW_H - QUIET_TOP_END - 40} />
        <rect x="617" y={QUIET_TOP_END + 240} width="3" height={VIEW_H - QUIET_TOP_END - 240} />
        <rect x="787" y={QUIET_TOP_END + 120} width="3" height={VIEW_H - QUIET_TOP_END - 120} />
        <rect x="957" y={QUIET_TOP_END + 200} width="3" height={VIEW_H - QUIET_TOP_END - 200} />
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
      <RegisterPatternSvg />
    </svg>
  );
}

export function LoginPatternGhost({ className }: LoginPatternProps): ReactElement {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 opacity-20",
        "origin-top-left translate-x-px translate-y-px scale-[1.02]",
        className,
      )}
      aria-hidden="true"
    >
      <LoginPattern />
    </div>
  );
}
