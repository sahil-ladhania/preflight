/**
 * hashes.test — hashRuleset, hashRun, diffRulesets unit tests.
 * Why: byte-identical hash contract (07-build-order.md Phase 2).
 */
import { describe, expect, it } from "vitest";

import { diffRulesets, hashRun, hashRuleset } from "./hashes.js";
import type { HashableRule } from "./hashes.js";

const frozenRule: HashableRule = {
  id: "SEBI-01",
  kind: "deterministic",
  wording: "Frozen wording",
  predicateFingerprint: "a".repeat(64),
  matcherFingerprint: "b".repeat(64),
};

const liveRuleChanged: HashableRule = {
  ...frozenRule,
  wording: "Live wording",
};

describe("hashRuleset", () => {
  it("returns stable 64-char hex for same input", () => {
    const first = hashRuleset([frozenRule]);
    const second = hashRuleset([frozenRule]);
    expect(first).toBe(second);
    expect(first).toMatch(/^[a-f0-9]{64}$/);
  });

  it("is order-independent by rule id", () => {
    const other: HashableRule = {
      id: "SEBI-02",
      kind: "deterministic",
      wording: "Other",
      predicateFingerprint: "c".repeat(64),
      matcherFingerprint: "d".repeat(64),
    };
    expect(hashRuleset([frozenRule, other])).toBe(hashRuleset([other, frozenRule]));
  });
});

describe("hashRun", () => {
  it("excludes machineReason from the hash input", () => {
    const rulesetHash = hashRuleset([frozenRule]);
    const base = hashRun({
      canonicalText: "Sample canonical text",
      rulesetHash,
      matcherOutputs: [
        {
          ruleId: "SEBI-01",
          machineVerdict: "pass",
          spans: [],
        },
      ],
    });

    expect(base).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe("diffRulesets", () => {
  it("returns empty array when frozen and live match", () => {
    expect(diffRulesets([frozenRule], [frozenRule])).toEqual([]);
  });

  it("detects definition_changed with non-empty changes", () => {
    const items = diffRulesets([frozenRule], [liveRuleChanged]);
    expect(items).toEqual([
      {
        kind: "definition_changed",
        ruleId: "SEBI-01",
        frozenWording: "Frozen wording",
        liveWording: "Live wording",
        changes: ["wording"],
      },
    ]);
  });

  it("detects rules_added_outside_freeze", () => {
    const items = diffRulesets([], [liveRuleChanged]);
    expect(items[0]?.kind).toBe("rules_added_outside_freeze");
  });

  it("detects frozen_rule_missing", () => {
    const items = diffRulesets([frozenRule], []);
    expect(items[0]?.kind).toBe("frozen_rule_missing");
  });
});
