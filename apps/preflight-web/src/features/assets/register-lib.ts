/**
 * register-lib — Screen 2 filter, sort, and summary helpers.
 * Why: register chrome and table share one urgency model (09 R2).
 */

import type { AssetListItemDTO, AssetStatus } from "@preflight/schemas";

import type { PersonaId } from "@/features/shell/types";

export type RegisterFilter = "needs_you" | "all" | "resolved";

export const REGISTER_ROW_GRID =
  "grid grid-cols-[110px_minmax(0,1.2fr)_140px_minmax(180px,1.4fr)_168px_96px] items-start gap-x-3";

const NEEDS_YOU_STATUSES: AssetStatus[] = [
  "blocked",
  "needs_human",
  "needs_regen",
];

const URGENCY_RANK: Record<AssetStatus, number> = {
  blocked: 1,
  needs_human: 2,
  needs_regen: 3,
  cleared_with_exception: 4,
  clear: 5,
};

export function isNeedsYouStatus(status: AssetStatus): boolean {
  return NEEDS_YOU_STATUSES.includes(status);
}

export function isResolvedStatus(status: AssetStatus): boolean {
  return status === "clear" || status === "cleared_with_exception";
}

export function defaultRegisterFilter(personaId: PersonaId): RegisterFilter {
  return personaId === "arjun" ? "needs_you" : "all";
}

export function sortRegisterAssets(
  assets: AssetListItemDTO[],
): AssetListItemDTO[] {
  return [...assets].sort((left, right) => {
    const rankDiff = URGENCY_RANK[left.status] - URGENCY_RANK[right.status];
    if (rankDiff !== 0) {
      return rankDiff;
    }
    return (
      new Date(left.generatedAt).getTime() -
      new Date(right.generatedAt).getTime()
    );
  });
}

export interface RegisterCounts {
  needYou: number;
  blocked: number;
  readyToShip: number;
  resolved: number;
  pendingRules: number;
}

export function registerCounts(assets: AssetListItemDTO[]): RegisterCounts {
  let needYou = 0;
  let blocked = 0;
  let readyToShip = 0;
  let pendingRules = 0;

  for (const asset of assets) {
    if (isNeedsYouStatus(asset.status)) {
      needYou++;
    }
    if (asset.status === "blocked") {
      blocked++;
    }
    if (isResolvedStatus(asset.status)) {
      readyToShip++;
    }
    pendingRules += asset.pendingCount;
  }

  return {
    needYou,
    blocked,
    readyToShip,
    resolved: readyToShip,
    pendingRules,
  };
}

export function workSummaryLine(assets: AssetListItemDTO[]): string {
  const counts = registerCounts(assets);
  let line: string;

  if (counts.needYou === 0) {
    line = `Nothing needs you. ${counts.readyToShip} ready to ship.`;
  } else {
    const parts = [`${counts.needYou} need you`];
    if (counts.blocked > 0) {
      parts.push(`${counts.blocked} blocked`);
    }
    parts.push(`${counts.readyToShip} ready to ship`);
    line = parts.join(" · ");
  }

  if (counts.pendingRules > 0) {
    line = `${line} Evaluating ${counts.pendingRules} rules…`;
  }

  return line;
}

export function endOfRegisterLine(assets: AssetListItemDTO[]): string {
  const counts = registerCounts(assets);
  return `End of register — ${counts.needYou} need you · ${counts.resolved} resolved`;
}

export function splitRegisterSections(
  assets: AssetListItemDTO[],
  filter: RegisterFilter,
): { needsYou: AssetListItemDTO[]; resolved: AssetListItemDTO[] } {
  const sorted = sortRegisterAssets(assets);
  const needsYou = sorted.filter((asset) => isNeedsYouStatus(asset.status));
  const resolved = sorted.filter((asset) => isResolvedStatus(asset.status));

  if (filter === "needs_you") {
    return { needsYou, resolved: [] };
  }
  if (filter === "resolved") {
    return { needsYou: [], resolved };
  }
  return { needsYou, resolved };
}
