/**
 * performance-substantiation — SEBI-05 substantiation matcher.
 * Why: adversarial cases in same file (07-build-order.md).
 */
import { collapseForScan } from "../lib/text.js";
import { spanForMatch } from "../lib/span.js";
import type { MatcherResult } from "../span.js";

export const PERFORMANCE_SUBSTANTIATION_MATCHER_VERSION = "sebi-05-v1";

export const SUBSTANTIATION_MARKERS = [
  "substantiat",
  "not indicative",
  "not a guarantee",
  "scheme related documents",
  "offer document",
  "verified by",
  "audited",
] as const;

export function matchPerformanceSubstantiation(
  canonicalText: string,
): MatcherResult {
  const collapsed = collapseForScan(canonicalText);
  const hasPastPerformance = collapsed.includes("past performance");
  const percentMatch = canonicalText.match(/\d+(?:\.\d+)?\s*%/);

  if (!hasPastPerformance && !percentMatch) {
    return {
      machineVerdict: "pass",
      machineReason: "No performance figure requiring substantiation.",
      spans: [],
    };
  }

  const hasMarker = SUBSTANTIATION_MARKERS.some((marker) =>
    collapsed.includes(marker),
  );

  if (hasMarker) {
    return {
      machineVerdict: "pass",
      machineReason: "Performance figure includes substantiation.",
      spans: [],
    };
  }

  const needle = hasPastPerformance
    ? "Past performance"
    : (percentMatch?.[0] ?? canonicalText.slice(0, 19));
  const span = spanForMatch(canonicalText, needle, 0);

  return {
    machineVerdict: "fail",
    machineReason: "Performance figure lacks required substantiation.",
    spans: span ? [span] : [],
  };
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe("matchPerformanceSubstantiation", () => {
    it("passes when no performance figure is cited", () => {
      const text = "Bluepeak Flexi Cap Fund offers diversified flexi cap exposure.";
      expect(matchPerformanceSubstantiation(text).machineVerdict).toBe("pass");
    });

    it("fails when past performance lacks substantiation markers", () => {
      const text =
        "Past performance of 18.4% over 3 years shown for illustration.";
      expect(matchPerformanceSubstantiation(text).machineVerdict).toBe("fail");
    });

    it("passes when substantiation language is present", () => {
      const text =
        "Past performance of 18.4% over 3 years is not indicative of future results.";
      expect(matchPerformanceSubstantiation(text).machineVerdict).toBe("pass");
    });

    it("fails on percentage claim without substantiation", () => {
      const text = "Returns reached 18.4% last quarter with strong inflows.";
      expect(matchPerformanceSubstantiation(text).machineVerdict).toBe("fail");
    });

    it("passes when verified and audited markers are present", () => {
      const text = "Past performance of 12% verified by audited statements.";
      expect(matchPerformanceSubstantiation(text).machineVerdict).toBe("pass");
    });
  });
}
