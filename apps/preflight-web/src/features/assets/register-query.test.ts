/**
 * register-query.test.ts — client-side register filter and pagination helpers.
 */

import { describe, expect, it } from "vitest";

import type { AssetListItemDTO } from "@preflight/schemas";

import {
  applyRegisterQuery,
  pageCount,
  pageSlice,
  REGISTER_PAGE_SIZE,
} from "@/features/assets/register-query";

function asset(partial: Partial<AssetListItemDTO>): AssetListItemDTO {
  return {
    id: partial.id ?? "asset-1",
    campaignId: partial.campaignId ?? "campaign-1",
    headline: partial.headline ?? "Headline",
    campaignName: partial.campaignName ?? "Campaign A",
    channel: partial.channel ?? "email",
    status: partial.status ?? "clear",
    statusDetail: partial.statusDetail ?? "Ready to ship",
    generatedAt: partial.generatedAt ?? "2026-03-01T12:00:00.000Z",
    pendingCount: partial.pendingCount ?? 0,
    generationIndex: partial.generationIndex ?? 1,
    regeneratedFromId: partial.regeneratedFromId ?? null,
  };
}

describe("applyRegisterQuery", () => {
  const rows = [
    asset({
      id: "a",
      headline: "Alpha fund email",
      campaignName: "Alpha",
      status: "blocked",
      generatedAt: "2026-03-01T12:00:00.000Z",
    }),
    asset({
      id: "b",
      headline: "Beta landing",
      campaignName: "Beta",
      status: "clear",
      generatedAt: "2026-03-03T12:00:00.000Z",
    }),
  ];

  it("filters by search and campaign", () => {
    const result = applyRegisterQuery(rows, {
      search: "alpha",
      campaign: "Alpha",
      status: "any",
      sort: "urgent",
    });

    expect(result.map((row) => row.id)).toEqual(["a"]);
  });

  it("sorts newest first", () => {
    const result = applyRegisterQuery(rows, {
      search: "",
      campaign: "all",
      status: "any",
      sort: "newest",
    });

    expect(result.map((row) => row.id)).toEqual(["b", "a"]);
  });
});

describe("pageSlice", () => {
  it("returns the requested page", () => {
    const rows = Array.from({ length: 20 }, (_, index) => `row-${index}`);
    expect(pageSlice(rows, 2, REGISTER_PAGE_SIZE)).toHaveLength(5);
    expect(pageCount(20, REGISTER_PAGE_SIZE)).toBe(2);
  });
});
