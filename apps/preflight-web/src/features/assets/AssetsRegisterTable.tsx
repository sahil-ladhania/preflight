import type { ReactElement } from "react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssetListRow } from "@/features/assets/AssetListRow";
import { splitRegisterSections } from "@/features/assets/register-lib";
import type { AssetsRegisterTableProps } from "@/features/assets/types";

function ColumnHeaderRow(): ReactElement {
  return (
    <TableRow className="border-b border-fg hover:bg-transparent">
      <TableHead className="w-[120px] font-sans text-label font-normal uppercase tracking-wider text-fg-muted">
        Status
      </TableHead>
      <TableHead className="min-w-[180px] font-sans text-label font-normal uppercase tracking-wider text-fg-muted">
        Asset
      </TableHead>
      <TableHead className="w-[140px] font-sans text-label font-normal uppercase tracking-wider text-fg-muted">
        Campaign
      </TableHead>
      <TableHead className="min-w-[200px] font-sans text-label font-normal uppercase tracking-wider text-fg-muted">
        Reason
      </TableHead>
      <TableHead className="w-[150px] font-sans text-label font-normal uppercase tracking-wider text-fg-muted">
        Generated
      </TableHead>
      <TableHead className="w-[110px] font-sans text-label font-normal uppercase tracking-wider text-fg-muted">
        Version
      </TableHead>
    </TableRow>
  );
}

function RegisterSection({
  label,
  count,
  assets,
}: {
  type: "needs_you" | "resolved";
  label: string;
  count: number;
  assets: AssetsRegisterTableProps["assets"];
}): ReactElement {
  if (assets.length === 0) {
    return <></>;
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2.5 pb-1">
        <h2 className="font-serif text-wordmark font-semibold tracking-tight text-fg">
          {label}
        </h2>
        <span className="font-mono text-xs text-fg-muted">
          [{count}]
        </span>
      </div>
      <Table>
        <TableHeader>
          <ColumnHeaderRow />
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <AssetListRow key={asset.id} asset={asset} />
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export function AssetsRegisterTable({
  assets,
  filter,
}: AssetsRegisterTableProps): ReactElement {
  const { needsYou, resolved } = splitRegisterSections(assets, filter);

  if (needsYou.length === 0 && resolved.length === 0) {
    return (
      <div className="py-12 text-center text-caption text-fg-muted">
        No matching assets found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <RegisterSection
        type="needs_you"
        label="Needs you"
        count={needsYou.length}
        assets={needsYou}
      />
      <RegisterSection
        type="resolved"
        label="Resolved"
        count={resolved.length}
        assets={resolved}
      />
    </div>
  );
}
