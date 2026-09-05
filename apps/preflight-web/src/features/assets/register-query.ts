/**
 * register-query — client-side filter, sort, and pagination for Screen 2.
 * Why: demo-scale register controls without new API surface.
 */

import type { AssetListItemDTO, AssetStatus } from "@preflight/schemas";

import { sortRegisterAssets } from "@/features/assets/register-lib";

export type RegisterSort = "urgent" | "newest" | "oldest";

export type RegisterStatusFilter = AssetStatus | "any";

export interface RegisterQuery {
  search: string;
  campaign: string | "all";
  status: RegisterStatusFilter;
  sort: RegisterSort;
}

export const REGISTER_PAGE_SIZE = 15;

export function registerCampaignOptions(
  assets: AssetListItemDTO[],
): string[] {
  const names = new Set<string>();
  for (const asset of assets) {
    const name = asset.campaignName.trim();
    if (name.length > 0) {
      names.add(name);
    }
  }
  return [...names].sort((left, right) => left.localeCompare(right));
}

function sortByGeneratedAt(
  assets: AssetListItemDTO[],
  direction: "asc" | "desc",
): AssetListItemDTO[] {
  return [...assets].sort((left, right) => {
    const leftTime = new Date(left.generatedAt).getTime();
    const rightTime = new Date(right.generatedAt).getTime();
    return direction === "asc" ? leftTime - rightTime : rightTime - leftTime;
  });
}

export function applyRegisterQuery(
  assets: AssetListItemDTO[],
  query: RegisterQuery,
): AssetListItemDTO[] {
  const search = query.search.trim().toLowerCase();
  let rows = assets;

  if (search.length > 0) {
    rows = rows.filter(
      (asset) =>
        asset.headline.toLowerCase().includes(search) ||
        asset.campaignName.toLowerCase().includes(search),
    );
  }

  if (query.campaign !== "all") {
    rows = rows.filter((asset) => asset.campaignName === query.campaign);
  }

  if (query.status !== "any") {
    rows = rows.filter((asset) => asset.status === query.status);
  }

  if (query.sort === "urgent") {
    return sortRegisterAssets(rows);
  }
  if (query.sort === "newest") {
    return sortByGeneratedAt(rows, "desc");
  }
  return sortByGeneratedAt(rows, "asc");
}

export function pageSlice<T>(rows: T[], page: number, size: number): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * size;
  return rows.slice(start, start + size);
}

export function pageCount(rowCount: number, size: number): number {
  if (rowCount === 0) {
    return 1;
  }
  return Math.ceil(rowCount / size);
}
