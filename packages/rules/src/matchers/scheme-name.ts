/**
 * scheme-name — SEBI-02 first-mention scheme name matcher.
 * Why: adversarial cases in same file (07-build-order.md).
 */
import { describe, expect, it } from "vitest";

import { normalizeWhitespace } from "../lib/text.js";
import { spanAt } from "../lib/span.js";
import type { MatcherResult } from "../span.js";

export const SCHEME_NAME_MATCHER_VERSION = "sebi-02-v1";

const FIRST_MENTION_WINDOW = 250;

export function matchSchemeName(canonicalText: string): MatcherResult {
  const normalizedFull = normalizeWhitespace(canonicalText);
  const windowText = normalizedFull.slice(0, FIRST_MENTION_WINDOW);

  const fundIndex = windowText.search(/\bfund\b/i);
  const schemePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,})\b/;
  const schemeMatch = windowText.match(schemePattern);

  if (schemeMatch?.[1] !== undefined && schemeMatch.index !== undefined) {
    const beforeFund =
      fundIndex === -1 ? windowText.length : Math.min(fundIndex, windowText.length);
    if (schemeMatch.index <= beforeFund + 1) {
      return {
        machineVerdict: "pass",
        machineReason: "Scheme name appears on first mention.",
        spans: [],
      };
    }
  }

  const highlightLength = Math.min(48, canonicalText.length);
  return {
    machineVerdict: "fail",
    machineReason: "Scheme name missing on first mention.",
    spans: highlightLength > 0 ? [spanAt(canonicalText, 0, highlightLength)] : [],
  };
}

describe("matchSchemeName", () => {
  it("passes when scheme name leads the copy", () => {
    const text =
      "Bluepeak Flexi Cap Fund offers diversified flexi cap exposure across market caps.";
    expect(matchSchemeName(text).machineVerdict).toBe("pass");
  });

  it("passes when scheme name appears before generic fund reference", () => {
    const text = "Grow your wealth with Bluepeak Flexi Cap.";
    expect(matchSchemeName(text).machineVerdict).toBe("pass");
  });

  it("passes when scheme name is split across a line break", () => {
    const text = "Bluepeak Flexi\nCap Fund continues to attract investors.";
    expect(matchSchemeName(text).machineVerdict).toBe("pass");
  });

  it("fails when first mention is generic with no scheme name", () => {
    const text = "Our fund offers market-beating results for every investor.";
    expect(matchSchemeName(text).machineVerdict).toBe("fail");
  });
});
