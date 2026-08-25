/**
 * banned-phrase — SEBI-04 banned promotional phrase matcher.
 * Why: adversarial cases in same file (07-build-order.md).
 */
import { collapseForScan } from "../lib/text.js";
import { spanForMatch } from "../lib/span.js";
import type { MatcherResult } from "../span.js";

export const BANNED_PHRASE_MATCHER_VERSION = "sebi-04-v1";

const BANNED_PHRASES = [
  "risk free",
  "risk-free",
  "assured returns",
  "best fund",
  "no loss",
  "100% safe",
  "market beating",
  "market-beating",
] as const;

export function matchBannedPhrase(canonicalText: string): MatcherResult {
  const collapsed = collapseForScan(canonicalText);

  for (const phrase of BANNED_PHRASES) {
    const index = collapsed.indexOf(phrase);
    if (index === -1) {
      continue;
    }

    const rawNeedle = findRawNeedle(canonicalText, phrase);
    const span = rawNeedle
      ? spanForMatch(canonicalText, rawNeedle, 0)
      : null;

    return {
      machineVerdict: "fail",
      machineReason: `Banned promotional phrase detected: "${phrase}".`,
      spans: span ? [span] : [],
    };
  }

  return {
    machineVerdict: "pass",
    machineReason: "No banned promotional phrases detected.",
    spans: [],
  };
}

function findRawNeedle(canonicalText: string, phrase: string): string | null {
  const variants = [
    phrase,
    phrase.replace(/-/g, " "),
    phrase.replace(/ /g, "-"),
    phrase.replace(/-/g, "\u2013"),
  ];

  for (const variant of variants) {
    const index = canonicalText.toLowerCase().indexOf(variant.toLowerCase());
    if (index !== -1) {
      return canonicalText.slice(index, index + variant.length);
    }
  }

  return null;
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe("matchBannedPhrase", () => {
  it("passes clean promotional copy", () => {
    const text = "Bluepeak Flexi Cap Fund offers diversified flexi cap exposure.";
    expect(matchBannedPhrase(text).machineVerdict).toBe("pass");
  });

  it("fails on hyphenated banned phrase", () => {
    const text = "The only fund you need for market-beating results.";
    expect(matchBannedPhrase(text).machineVerdict).toBe("fail");
  });

  it("fails when banned phrase uses spaces instead of hyphen", () => {
    const text = "Invest in our risk free opportunity today.";
    expect(matchBannedPhrase(text).machineVerdict).toBe("fail");
  });

  it("fails when banned phrase is inside quoted objection", () => {
    const text = 'Critics say we are "risk free" but compliance disagrees.';
    expect(matchBannedPhrase(text).machineVerdict).toBe("fail");
  });

  it("fails on en-dash risk-free variant", () => {
    const text = "This is a risk\u2013free way to grow wealth.";
    expect(matchBannedPhrase(text).machineVerdict).toBe("fail");
  });

  it("fails on assured returns banned phrase", () => {
    const text = "Assured returns await every new investor.";
    expect(matchBannedPhrase(text).machineVerdict).toBe("fail");
  });
  });
}
