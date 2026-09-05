/**
 * Overview — Screen landing register for all personas.
 * Why: shows what is unresolved and whether proof is getting faster.
 */

import type { ReactElement } from "react";

import { OverviewLayout } from "@/features/overview/OverviewLayout";
import { OverviewShell } from "@/features/overview/OverviewShell";
import { overviewStateCounts } from "@/features/overview/lib";
import type { OverviewData } from "@/features/overview/types";
import { OVERVIEW_FIXTURE } from "@/fixtures/overview";
import { usePersona } from "@/features/shell/PersonaProvider";

export interface OverviewProps {
  data?: OverviewData;
}

export function Overview({
  data = OVERVIEW_FIXTURE,
}: OverviewProps): ReactElement {
  const { actor } = usePersona();
  const personaId = actor?.id ?? "arjun";
  const stateCounts = overviewStateCounts(data.assets, data.campaigns);

  return (
    <OverviewShell stateCounts={stateCounts} personaId={personaId}>
      <OverviewLayout data={data} personaId={personaId} />
    </OverviewShell>
  );
}

export function OverviewRoute(): ReactElement {
  return <Overview />;
}

export default OverviewRoute;
