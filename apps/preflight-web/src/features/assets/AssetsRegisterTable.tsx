/**
 * AssetsRegisterTable — sectioned register rows with per-section pagination.
 * Why: Screen 2 splits needs-you and resolved; long lists paginate locally.
 */
// size: pagination + two section blocks share one table module

import type { ReactElement, ReactNode } from "react";
import { CircleCheck, Inbox } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssetListRow } from "@/features/assets/AssetListRow";
import {
  splitRegisterSections,
} from "@/features/assets/register-lib";
import {
  pageCount,
  pageSlice,
  REGISTER_PAGE_SIZE,
} from "@/features/assets/register-query";
import type { AssetsRegisterTableProps } from "@/features/assets/types";
import { OverviewSectionHeading } from "@/features/overview/OverviewSectionHeading";

export function ColumnHeaderRow(): ReactElement {
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

function RegisterSectionPagination({
  page,
  totalRows,
  onPageChange,
}: {
  page: number;
  totalRows: number;
  onPageChange: (page: number) => void;
}): ReactElement | null {
  if (totalRows <= REGISTER_PAGE_SIZE) {
    return null;
  }

  const pages = pageCount(totalRows, REGISTER_PAGE_SIZE);

  return (
    <Pagination className="justify-start pt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>
            {page}
          </PaginationLink>
        </PaginationItem>
        {pages > 1 ? (
          <PaginationItem>
            <span className="px-1 font-sans text-[11px] text-fg-muted">
              of {pages}
            </span>
          </PaginationItem>
        ) : null}
        <PaginationItem>
          <PaginationNext
            disabled={page >= pages}
            onClick={() => onPageChange(Math.min(pages, page + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function RegisterSection({
  label,
  count,
  assets,
  icon,
  showHeading,
  page,
  onPageChange,
  onOpenLineage,
}: {
  label: string;
  count: number;
  assets: AssetsRegisterTableProps["assets"];
  icon: ReactNode;
  showHeading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onOpenLineage?: (assetId: string) => void;
}): ReactElement {
  if (assets.length === 0) {
    return <></>;
  }

  const visibleAssets = pageSlice(assets, page, REGISTER_PAGE_SIZE);

  return (
    <section className="flex flex-col gap-3">
      {showHeading ? (
        <OverviewSectionHeading title={label} count={count} icon={icon} />
      ) : null}
      <Table>
        <TableHeader>
          <ColumnHeaderRow />
        </TableHeader>
        <TableBody>
          {visibleAssets.map((asset) => (
            <AssetListRow
              key={asset.id}
              asset={asset}
              onOpenLineage={onOpenLineage}
            />
          ))}
        </TableBody>
      </Table>
      <RegisterSectionPagination
        page={page}
        totalRows={assets.length}
        onPageChange={onPageChange}
      />
    </section>
  );
}

export function AssetsRegisterTable({
  assets,
  filter,
  needsYouPage,
  resolvedPage,
  onNeedsYouPageChange,
  onResolvedPageChange,
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

  const showSectionHeadings = filter === "all";

  return (
    <div className="flex flex-col gap-12">
      <RegisterSection
        label="Needs you"
        count={needsYou.length}
        assets={needsYou}
        icon={<Inbox className="size-4" />}
        showHeading={showSectionHeadings}
        page={needsYouPage}
        onPageChange={onNeedsYouPageChange}
        onOpenLineage={onOpenLineage}
      />
      <RegisterSection
        label="Resolved"
        count={resolved.length}
        assets={resolved}
        icon={<CircleCheck className="size-4" />}
        showHeading={showSectionHeadings}
        page={resolvedPage}
        onPageChange={onResolvedPageChange}
        onOpenLineage={onOpenLineage}
      />
    </div>
  );
}
