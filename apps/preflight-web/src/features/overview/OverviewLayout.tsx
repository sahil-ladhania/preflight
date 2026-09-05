/**
 * OverviewLayout — unified two-column grid with persona reading order.
 * Why: left/right column stacks keep register link tight to Needs you and Rule pressure.
 */

import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { DriftSection } from "@/features/overview/DriftSection";
import { ExceptionsSection } from "@/features/overview/ExceptionsSection";
import { NeedsYouSection } from "@/features/overview/NeedsYouSection";
import { ProofSpeedSection } from "@/features/overview/ProofSpeedSection";
import { RulePressureListsSection } from "@/features/overview/RulePressureListsSection";
import type { OverviewData } from "@/features/overview/types";
import type { PersonaId } from "@/features/shell/types";

function GridCell({
  children,
  wide,
  fullWidth,
}: {
  children: ReactNode;
  wide?: boolean;
  fullWidth?: boolean;
}): ReactElement {
  return (
    <div
      className={cn(
        "min-w-0",
        !wide && !fullWidth && "max-w-prose lg:max-w-none",
        fullWidth && "lg:col-span-2",
      )}
    >
      {children}
    </div>
  );
}

function ColumnStack({ children }: { children: ReactNode }): ReactElement {
  return <div className="flex flex-col gap-12">{children}</div>;
}

export function OverviewLayout({
  data,
  personaId,
}: {
  data: OverviewData;
  personaId: PersonaId;
}): ReactElement {
  const needsYou = <NeedsYouSection assets={data.assets} />;
  const exceptions = <ExceptionsSection exceptions={data.exceptions} />;
  const proofSpeed = <ProofSpeedSection proofSpeed={data.proofSpeed} />;
  const rulePressure = (
    <RulePressureListsSection rulePressure={data.rulePressure} />
  );
  const drift = (
    <DriftSection driftAssetCount={data.rulePressure.driftAssetCount} />
  );

  const wideColumn = (
    <GridCell wide>
      <ColumnStack>
        {needsYou}
        {rulePressure}
      </ColumnStack>
    </GridCell>
  );
  const narrowColumn = (
    <GridCell>
      <ColumnStack>
        {exceptions}
        {drift}
      </ColumnStack>
    </GridCell>
  );

  return (
    <div className="mb-12 grid grid-cols-1 items-start gap-y-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start lg:gap-x-12 lg:gap-y-12">
      {personaId === "meera" ? (
        <>
          <GridCell fullWidth>{proofSpeed}</GridCell>
          {wideColumn}
          {narrowColumn}
        </>
      ) : (
        <>
          {wideColumn}
          {narrowColumn}
          <GridCell fullWidth>{proofSpeed}</GridCell>
        </>
      )}
    </div>
  );
}
