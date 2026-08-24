/**
 * types.test — compile-time export smoke (logic tests are Phase 2).
 */

import { describe, expect, it } from "vitest"
import type { StructuredBrief } from "./structured-brief.js"

describe("@preflight/rules types", () => {
  it("StructuredBrief shape accepts valid brief", () => {
    const brief: StructuredBrief = {
      objective: "Grow AUM",
      schemeName: "Alpha Fund",
      schemeCategory: "Equity",
      audience: "HNIs",
      channels: ["email", "linkedin"],
      market: "IN",
      performanceFigures: [{ value: "12%", period: "1Y" }],
      claims: ["Past performance"],
    }
    expect(brief.channels).toHaveLength(2)
  })
})
