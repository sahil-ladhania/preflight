/**
 * lib — top bar nav styling and queue count.
 * Why: 08 §5.1 weight-only active state and mono bracket count are shared rules.
 */

import type { AssetListItemDTO, AssetStatus } from "@preflight/schemas";

import { cn } from "@/lib/utils";

const QUEUE_STATUSES: ReadonlySet<AssetStatus> = new Set([
  "blocked",
  "needs_human",
  "needs_regen",
]);

export const PERSONA_MENU_COPY = {
  signedInPrefix: "Signed in —",
  accountabilityLine:
    "Decisions you make are recorded permanently under this name.",
  signOutLabel: "Sign out",
} as const;

export function queueCount(assets: AssetListItemDTO[]): number {
  return assets.filter((asset) => QUEUE_STATUSES.has(asset.status)).length;
}

export function navLinkClass(isActive: boolean): string {
  return cn(
    "text-(length:--text-caption) leading-[1.4] normal-case tracking-normal no-underline",
    isActive ? "font-semibold text-fg" : "font-normal text-fg-muted",
  );
}
