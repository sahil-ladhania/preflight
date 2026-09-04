/**
 * GeneratingPane — S2 building, generate phase: the frozen set stays on screen.
 * Why: generate is the longest wait in the chain and the only moment where
 * showing the freeze costs nothing — Meera watches copy being written against
 * the rules it must satisfy (09 Screen 3, S3).
 */

import type { ReactElement } from "react";

import type { CompileResponseDTO } from "@preflight/schemas";

import { BuildPanel } from "@/features/campaign/BuildPanel";
import { FreezeTable } from "@/features/campaign/FreezeTable";
import type { BuildPhase } from "@/features/campaign/types";

export interface GeneratingPaneProps {
  buildPhase: BuildPhase;
  buildInFlight: boolean;
  compileResult: CompileResponseDTO;
  onRunBuild: () => void;
}

export function GeneratingPane({
  buildPhase,
  buildInFlight,
  compileResult,
  onRunBuild,
}: GeneratingPaneProps): ReactElement {
  return (
    <div className="flex flex-col gap-4">
      <BuildPanel
        buildPhase={buildPhase}
        buildInFlight={buildInFlight}
        canBuild
        emptySetAcknowledged={false}
        onRunBuild={onRunBuild}
        onEmptySetAckChange={() => undefined}
      />
      <FreezeTable
        compileResult={compileResult}
        emptySetAcknowledged={false}
        staleBanner={false}
        showAcknowledgement={false}
        onEmptySetAckChange={() => undefined}
      />
    </div>
  );
}
