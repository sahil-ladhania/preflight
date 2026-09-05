import type { ReactElement, ReactNode } from "react";
import { CircleCheck, Inbox } from "lucide-react";

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
import { OverviewSectionHeading } from "@/features/overview/OverviewSectionHeading";

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
  icon,
  onOpenLineage,
}: {
  label: string;
  count: number;
  assets: AssetsRegisterTableProps["assets"];
  icon: ReactNode;
  onOpenLineage?: (assetId: string) => void;
}): ReactElement {
  if (assets.length === 0) {
    return <></>;
  }

  return (
    <section className="flex flex-col gap-3">
      <OverviewSectionHeading title={label} count={count} icon={icon} />
      <Table>
        <TableHeader>
          <ColumnHeaderRow />
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <AssetListRow
              key={asset.id}
              asset={asset}
              onOpenLineage={onOpenLineage}
            />
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export function AssetsRegisterTable({
  assets,
  filter,
  onOpenLineage,
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
        label="Needs you"
        count={needsYou.length}
        assets={needsYou}
        icon={<Inbox className="size-4" />}
        onOpenLineage={onOpenLineage}
      />
      <RegisterSection
        label="Resolved"
        count={resolved.length}
        assets={resolved}
        icon={<CircleCheck className="size-4" />}
        onOpenLineage={onOpenLineage}
      />
    </div>
  );
}
