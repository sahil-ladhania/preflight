import type { ReactElement } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <TableHead className="w-[120px] font-mono text-[10px] font-medium uppercase tracking-wider text-fg-muted">
        Status
      </TableHead>
      <TableHead className="min-w-[180px] font-mono text-[10px] font-medium uppercase tracking-wider text-fg-muted">
        Asset
      </TableHead>
      <TableHead className="w-[140px] font-mono text-[10px] font-medium uppercase tracking-wider text-fg-muted">
        Campaign
      </TableHead>
      <TableHead className="min-w-[200px] font-mono text-[10px] font-medium uppercase tracking-wider text-fg-muted">
        Reason
      </TableHead>
      <TableHead className="w-[150px] font-mono text-[10px] font-medium uppercase tracking-wider text-fg-muted">
        Generated
      </TableHead>
      <TableHead className="w-[110px] font-mono text-[10px] font-medium uppercase tracking-wider text-fg-muted">
        Version
      </TableHead>
    </TableRow>
  );
}

function RegisterSection({
  type,
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

  const isUrgent = type === "needs_you";

  return (
    <Card className="rounded-none border border-border bg-surface shadow-none overflow-hidden">
      <CardHeader className="border-b border-border/80 px-4 py-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <CardTitle className="font-serif text-sm font-semibold tracking-tight text-fg">
            {label}
          </CardTitle>
          <Badge
            variant={isUrgent ? "destructive" : "outline"}
            className="rounded-none font-mono text-[10px] uppercase font-medium"
          >
            {count} {isUrgent ? "pending" : "cleared"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
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
      </CardContent>
    </Card>
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
