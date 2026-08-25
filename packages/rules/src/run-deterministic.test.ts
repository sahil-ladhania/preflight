/**
 * run-deterministic.test — runner integration tests.
 * Why: locked runDeterministic signature (12 Area 1).
 */
import { describe, expect, it } from "vitest";

import {
  DETERMINISTIC_CATALOG,
  DETERMINISTIC_MATCHER_FINGERPRINTS,
  DETERMINISTIC_PREDICATE_FINGERPRINTS,
} from "./catalog.js";
import type { DetRunRule } from "./hashes.js";
import { runDeterministic } from "./run-deterministic.js";
import { matchDisclaimer } from "./matchers/disclaimer.js";

function detRunRules(): DetRunRule[] {
  return DETERMINISTIC_CATALOG.map((rule) => ({
    id: rule.id,
    kind: "deterministic" as const,
    wording: rule.wording,
    predicateFingerprint: DETERMINISTIC_PREDICATE_FINGERPRINTS[rule.id] ?? "",
    matcherFingerprint: DETERMINISTIC_MATCHER_FINGERPRINTS[rule.id] ?? "",
    match: rule.match,
  }));
}

describe("runDeterministic", () => {
  it("returns findings for each frozen det rule", () => {
    const canonicalText =
      "Bluepeak Flexi Cap Fund offers exposure. Mutual fund investments are subject to market risks.";
    const output = runDeterministic({
      canonicalText,
      rules: detRunRules(),
    });

    expect(output.findings).toHaveLength(5);
    expect(output.findings.every((finding) => finding.kind === "deterministic")).toBe(
      true,
    );
    expect(output.runHash).toMatch(/^[a-f0-9]{64}$/);
    expect(output.rulesetHash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("is stable for the same canonical text and rules", () => {
    const rules: DetRunRule[] = [
      {
        id: "SEBI-01",
        kind: "deterministic",
        wording: "Standard risk disclaimer must appear in the asset copy.",
        predicateFingerprint: DETERMINISTIC_PREDICATE_FINGERPRINTS["SEBI-01"] ?? "",
        matcherFingerprint: DETERMINISTIC_MATCHER_FINGERPRINTS["SEBI-01"] ?? "",
        match: matchDisclaimer,
      },
    ];
    const canonicalText =
      "Mutual fund investments are subject to market risks. Invest today.";

    const first = runDeterministic({ canonicalText, rules });
    const second = runDeterministic({ canonicalText, rules });

    expect(first).toEqual(second);
  });
});
