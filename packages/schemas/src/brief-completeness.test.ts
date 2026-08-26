/**
 * brief-completeness.test — shared readiness helpers.
 */

import { describe, expect, it } from "vitest"

import {
  isBriefComplete,
  mergeDraftBrief,
  missingBriefFields,
} from "./brief-completeness.js"
import type { StructuredBriefInput } from "./brief.js"

const completeBrief: StructuredBriefInput = {
  objective: "Launch awareness",
  schemeName: "Bluepeak Flexi Cap Fund",
  schemeCategory: "Flexi Cap",
  audience: "HNI investors",
  channels: ["email", "linkedin"],
  market: "India",
  performanceFigures: [{ value: "18.2%", period: "3-year CAGR" }],
  claims: ["Flexibility"],
}

describe("missingBriefFields", () => {
  it("returns empty when brief is complete", () => {
    expect(missingBriefFields(completeBrief)).toEqual([])
    expect(isBriefComplete(completeBrief)).toBe(true)
  })

  it("flags missing scalar fields and channels", () => {
    expect(
      missingBriefFields({
        objective: "",
        schemeName: "Bluepeak",
        channels: [],
      }),
    ).toEqual(
      expect.arrayContaining(["objective", "schemeCategory", "audience", "market", "channels"]),
    )
  })
})

describe("mergeDraftBrief", () => {
  it("merges later drafts over earlier ones", () => {
    const merged = mergeDraftBrief(
      { schemeName: "Old Fund", audience: "Retail" },
      { schemeName: "Bluepeak Flexi Cap Fund", market: "India" },
    )
    expect(merged.schemeName).toBe("Bluepeak Flexi Cap Fund")
    expect(merged.audience).toBe("Retail")
    expect(merged.market).toBe("India")
  })

  it("skips empty strings", () => {
    const merged = mergeDraftBrief({ objective: "  ", schemeName: "Fund" })
    expect(merged.objective).toBeUndefined()
    expect(merged.schemeName).toBe("Fund")
  })
})
