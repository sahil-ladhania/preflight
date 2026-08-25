/**
 * cagr — SEBI-03 CAGR / performance period matcher.
 * Why: adversarial cases in same file (07-build-order.md).
 */
import { spanForMatch } from "../lib/span.js";
import type { MatcherResult } from "../span.js";

export const CAGR_MATCHER_VERSION = "sebi-03-v1";

const PERIOD_PATTERN =
  /\b(\d+\s*-?\s*(?:year|years|yr|yrs|month|months)|\bCAGR\b)/i;

export function matchCagr(canonicalText: string): MatcherResult {
  const percentMatches = [...canonicalText.matchAll(/\d+(?:\.\d+)?\s*%/g)];
  const cagrMatches = [...canonicalText.matchAll(/\bCAGR\b/gi)];

  const triggers = [
    ...percentMatches.map((match) => ({
      index: match.index ?? 0,
      text: match[0],
    })),
    ...cagrMatches.map((match) => ({
      index: match.index ?? 0,
      text: match[0],
    })),
  ];

  if (triggers.length === 0) {
    return {
      machineVerdict: "pass",
      machineReason: "No CAGR or percentage performance claim in copy.",
      spans: [],
    };
  }

  const hasCagrLabel = /\bCAGR\b/i.test(canonicalText);
  const hasGlobalPeriod = PERIOD_PATTERN.test(canonicalText);

  for (const trigger of triggers) {
    const windowStart = Math.max(0, trigger.index - 120);
    const windowEnd = Math.min(canonicalText.length, trigger.index + 120);
    const window = canonicalText.slice(windowStart, windowEnd);

    if (PERIOD_PATTERN.test(window)) {
      continue;
    }

    if (
      trigger.text.includes("%") &&
      hasCagrLabel &&
      hasGlobalPeriod
    ) {
      continue;
    }

    const span = spanForMatch(canonicalText, trigger.text, trigger.index);
    return {
      machineVerdict: "fail",
      machineReason: "CAGR or percentage claim missing named period.",
      spans: span ? [span] : [],
    };
  }

  return {
    machineVerdict: "pass",
    machineReason: "Performance claims name the period.",
    spans: [],
  };
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe("matchCagr", () => {
    it("passes when no performance percentage is present", () => {
      const text = "Bluepeak Flexi Cap Fund offers diversified exposure.";
      expect(matchCagr(text).machineVerdict).toBe("pass");
    });

    it("passes when percentage includes a period in the same window", () => {
      const text = "Past performance of 18.4% over 3 years shown for illustration.";
      expect(matchCagr(text).machineVerdict).toBe("pass");
    });

    it("fails when percentage lacks a period label", () => {
      const text = "Delivered 18.4% returns with strong momentum.";
      expect(matchCagr(text).machineVerdict).toBe("fail");
    });

    it("passes when CAGR label appears in the previous sentence", () => {
      const text = "3-year CAGR. Returns reached 18.2% in the latest period.";
      expect(matchCagr(text).machineVerdict).toBe("pass");
    });
  });
}
