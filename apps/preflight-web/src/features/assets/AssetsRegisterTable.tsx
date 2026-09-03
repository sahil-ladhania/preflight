/**
 * AssetsRegisterTable — Screen 2 sectioned register rows.
 * Why: needs-you and resolved blocks each carry their own column header (09 R2).
 */

import type { ReactElement } from "react";

import { AssetListRow } from "@/features/assets/AssetListRow";
import {
  REGISTER_ROW_GRID,
  splitRegisterSections,
} from "@/features/assets/register-lib";
import type { AssetsRegisterTableProps } from "@/features/assets/types";
import { cn } from "@/lib/utils";

function ColumnHeaderRow(): ReactElement {
  return (
    <div className={cn(REGISTER_ROW_GRID, "border-b border-fg py-1.5")}>
      <span className="text-label uppercase text-fg-muted">Status</span>
      <span className="text-label uppercase text-fg-muted">Asset</span>
      <span className="text-label uppercase text-fg-muted">Campaign</span>
      <span className="text-label uppercase text-fg-muted">Reason</span>
      <span className="text-label uppercase text-fg-muted">Generated</span>
      <span className="text-label uppercase text-fg-muted">Version</span>
    </div>
  );
}

function RegisterSection({
  label,
  assets,
}: {
  label: string;
  assets: AssetsRegisterTableProps["assets"];
}): ReactElement {
  if (assets.length === 0) {
    return <></>;
  }

  return (
    <section className="flex flex-col">
      <p className="mb-2 text-[10px] leading-[1.4] font-semibold uppercase tracking-[0.06em] text-fg-muted">
        {label}
      </p>
      <ColumnHeaderRow />
      {assets.map((asset) => (
        <AssetListRow key={asset.id} asset={asset} />
      ))}
    </section>
  );
}

export function AssetsRegisterTable({
  assets,
  filter,
}: AssetsRegisterTableProps): ReactElement {
  const { needsYou, resolved } = splitRegisterSections(assets, filter);

  return (
    <div className="flex flex-col gap-6">
      <RegisterSection
        label={`Needs you (${needsYou.length})`}
        assets={needsYou}
      />
      <RegisterSection
        label={`Resolved (${resolved.length})`}
        assets={resolved}
      />
    </div>
  );
}
