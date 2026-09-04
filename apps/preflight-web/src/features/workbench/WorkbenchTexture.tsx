/**
 * WorkbenchTexture — route-isolated ledger-grid texture for /workbench.
 * Why: sanctioned containment (08 §3.6); honest signalling of generative surface.
 * Grid in decision hue at 3.5% alpha max, masked to zero by 40% viewport height.
 */

import type { ReactElement } from "react";

import { RegisterGrid } from "@/features/shell/RegisterGrid";

export function WorkbenchTexture(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse 65% 45% at 50% 0%, black 0%, rgba(0,0,0,0.5) 45%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 65% 45% at 50% 0%, black 0%, rgba(0,0,0,0.5) 45%, transparent 100%)",
      }}
    >
      <RegisterGrid
        stroke="#2c4257"
        strokeOpacity={0.035}
        vStrokeOpacity={0.025}
        fill="#2c4257"
        fillOpacity={0.02}
        className="h-full w-full"
      />
    </div>
  );
}
