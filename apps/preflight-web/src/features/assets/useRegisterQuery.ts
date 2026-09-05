/**
 * useRegisterQuery — register toolbar state and per-section page indices.
 * Why: keeps AssetsList under file-size limit while controls stay real locally.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import type { AssetListItemDTO } from "@preflight/schemas";

import {
  applyRegisterQuery,
  type RegisterQuery,
  type RegisterSort,
  type RegisterStatusFilter,
} from "@/features/assets/register-query";

const DEFAULT_QUERY: RegisterQuery = {
  search: "",
  campaign: "all",
  status: "any",
  sort: "urgent",
};

export function useRegisterQuery(assets: AssetListItemDTO[]): {
  query: RegisterQuery;
  filteredAssets: AssetListItemDTO[];
  needsYouPage: number;
  resolvedPage: number;
  setSearch: (value: string) => void;
  setCampaign: (value: string | "all") => void;
  setStatus: (value: RegisterStatusFilter) => void;
  setSort: (value: RegisterSort) => void;
  setNeedsYouPage: (page: number) => void;
  setResolvedPage: (page: number) => void;
  resetPages: () => void;
} {
  const [query, setQuery] = useState<RegisterQuery>(DEFAULT_QUERY);
  const [needsYouPage, setNeedsYouPage] = useState(1);
  const [resolvedPage, setResolvedPage] = useState(1);

  const filteredAssets = useMemo(
    () => applyRegisterQuery(assets, query),
    [assets, query],
  );

  const resetPages = useCallback((): void => {
    setNeedsYouPage(1);
    setResolvedPage(1);
  }, []);

  useEffect(() => {
    resetPages();
  }, [query.search, query.campaign, query.status, query.sort, resetPages]);

  const patchQuery = useCallback((patch: Partial<RegisterQuery>): void => {
    setQuery((current) => ({ ...current, ...patch }));
  }, []);

  return {
    query,
    filteredAssets,
    needsYouPage,
    resolvedPage,
    setSearch: (value) => patchQuery({ search: value }),
    setCampaign: (value) => patchQuery({ campaign: value }),
    setStatus: (value) => patchQuery({ status: value }),
    setSort: (value) => patchQuery({ sort: value }),
    setNeedsYouPage,
    setResolvedPage,
    resetPages,
  };
}
