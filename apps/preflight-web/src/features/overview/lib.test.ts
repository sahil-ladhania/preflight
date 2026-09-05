/**
 * lib.test — Overview helpers unit tests.
 * Why: persona order and register counts are deterministic contract.
 */

import { describe, expect, it } from "vitest";

import { ASSETS_LIST_FIXTURE } from "@/fixtures/assets-list";
import { OVERVIEW_CAMPAIGNS } from "@/fixtures/overview/campaigns";

import {
  overviewSectionOrder,
  overviewStateCounts,
  topNeedsYouAssets,
} from "@/features/overview/lib";

describe("overviewSectionOrder", () => {
  it("puts needs you first for Arjun", () => {
    expect(overviewSectionOrder("arjun")[0]).toBe("needsYou");
    expect(overviewSectionOrder("arjun")[1]).toBe("exceptions");
  });

  it("puts proof speed first for Meera", () => {
    expect(overviewSectionOrder("meera")[0]).toBe("proofSpeed");
    expect(overviewSectionOrder("meera")[1]).toBe("needsYou");
  });
});

describe("overviewStateCounts", () => {
  it("counts need-human and exception assets from seed list", () => {
    const counts = overviewStateCounts(ASSETS_LIST_FIXTURE, OVERVIEW_CAMPAIGNS);
    expect(counts.needHuman).toBe(6);
    expect(counts.withException).toBe(1);
    expect(counts.campaignsInProgress).toBe(2);
  });
});

describe("topNeedsYouAssets", () => {
  it("returns blocked before needs_human", () => {
    const top = topNeedsYouAssets(ASSETS_LIST_FIXTURE, 2);
    expect(top[0]?.status).toBe("blocked");
    expect(top[1]?.status).toBe("needs_human");
  });
});
