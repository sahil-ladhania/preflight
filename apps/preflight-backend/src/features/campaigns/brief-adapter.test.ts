/**
 * brief-adapter.test — brief-adapter drift tests.
 * Why: mandatory when adapter touched (14-backend-design.md Phase 7).
 */
import assert from "node:assert/strict";
import test from "node:test";

import { toStructuredBrief } from "./brief-adapter.js";

test("toStructuredBrief passes through valid brief", () => {
  const brief = toStructuredBrief({
    objective: "Drive awareness.",
    schemeName: "Bluepeak Flexi Cap Fund",
    schemeCategory: "Flexi Cap",
    audience: "Retail investors",
    channels: ["email", "display"],
    market: "India",
    performanceFigures: [{ value: "18.2%", period: "3-year CAGR" }],
    claims: ["Market-leading flexibility"],
  });

  assert.equal(brief.schemeName, "Bluepeak Flexi Cap Fund");
  assert.deepEqual(brief.channels, ["email", "display"]);
});
