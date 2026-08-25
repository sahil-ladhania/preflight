/**
 * disclaimer — SEBI-01 standard risk disclaimer matcher.
 * Why: adversarial cases in same file (07-build-order.md).
 */
import { describe, expect, it } from "vitest";

import { collapseForScan, normalizeWhitespace } from "../lib/text.js";
import { spanAt } from "../lib/span.js";
import type { MatcherResult } from "../span.js";

export const DISCLAIMER_MATCHER_VERSION = "sebi-01-v1";

const REQUIRED_PHRASE = "mutual fund investments are subject to market risks";

export function matchDisclaimer(canonicalText: string): MatcherResult {
  const normalized = collapseForScan(canonicalText);
  const pass = normalized.includes(REQUIRED_PHRASE);

  if (pass) {
    return {
      machineVerdict: "pass",
      machineReason: "Standard risk disclaimer present.",
      spans: [],
    };
  }

  const highlightLength = Math.min(72, canonicalText.length);
  const span =
    highlightLength > 0 ? spanAt(canonicalText, 0, highlightLength) : null;

  return {
    machineVerdict: "fail",
    machineReason: "Standard risk disclaimer absent.",
    spans: span ? [span] : [],
  };
}

describe("matchDisclaimer", () => {
  it("passes when required phrase is present", () => {
    const text =
      "Grow wealth. Mutual fund investments are subject to market risks. Invest now.";
    expect(matchDisclaimer(text).machineVerdict).toBe("pass");
  });

  it("passes with extra whitespace and mixed case", () => {
    const text = "MUTUAL   FUND  investments are subject to market risks.";
    expect(matchDisclaimer(text).machineVerdict).toBe("pass");
  });

  it("fails on near-miss reworded disclaimer", () => {
    const text = "Mutual funds are subject to market risk.";
    expect(matchDisclaimer(text).machineVerdict).toBe("fail");
  });

  it("fails when disclaimer is entirely absent", () => {
    const text =
      "Grow your wealth with Bluepeak Flexi Cap. No disclaimer included in this short update.";
    const result = matchDisclaimer(text);
    expect(result.machineVerdict).toBe("fail");
    expect(normalizeWhitespace(result.machineReason)).toContain("absent");
  });
});
