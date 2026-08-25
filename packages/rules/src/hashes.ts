/**
 * hashes — hashRuleset, hashRun, diffRulesets locked signatures.
 * Why: compile pin, runHash, re-run strip (documentation/12 Area 1).
 */
import type { MatcherResult } from "./span.js";
import type { MatcherOutput } from "./finding.js";
import { sha256Hex } from "./lib/sha256.js";

export type RuleKind = "deterministic" | "judgement";

export type DriftKind =
  | "definition_changed"
  | "rules_added_outside_freeze"
  | "frozen_rule_missing";

export type DriftChange = "wording" | "predicate" | "matcher";

export interface HashableRule {
  id: string;
  kind: RuleKind;
  wording: string;
  predicateFingerprint: string;
  matcherFingerprint: string | null;
}

export interface DetRunRule extends HashableRule {
  kind: "deterministic";
  matcherFingerprint: string;
  match: (canonicalText: string) => MatcherResult;
}

export type DriftItem =
  | {
      kind: "definition_changed";
      ruleId: string;
      frozenWording: string;
      liveWording: string;
      changes: DriftChange[];
    }
  | {
      kind: "rules_added_outside_freeze";
      ruleId: string;
      liveWording: string;
    }
  | {
      kind: "frozen_rule_missing";
      ruleId: string;
      frozenWording: string;
    };

export interface HashRunInput {
  canonicalText: string;
  rulesetHash: string;
  matcherOutputs: MatcherOutput[];
}

export function hashRuleset(defs: HashableRule[]): string {
  const sorted = [...defs].sort((left, right) => left.id.localeCompare(right.id));
  const payload = sorted.map((rule) => ({
    id: rule.id,
    kind: rule.kind,
    wording: rule.wording,
    predicateFingerprint: rule.predicateFingerprint,
    matcherFingerprint: rule.matcherFingerprint,
  }));

  return sha256Hex(JSON.stringify(payload));
}

export function hashRun(input: HashRunInput): string {
  const sortedOutputs = [...input.matcherOutputs].sort((left, right) =>
    left.ruleId.localeCompare(right.ruleId),
  );
  const payload = {
    canonicalText: input.canonicalText,
    rulesetHash: input.rulesetHash,
    matcherOutputs: sortedOutputs.map((output) => ({
      ruleId: output.ruleId,
      machineVerdict: output.machineVerdict,
      spans: output.spans,
    })),
  };

  return sha256Hex(JSON.stringify(payload));
}

export function diffRulesets(
  frozen: HashableRule[],
  live: HashableRule[],
): DriftItem[] {
  const frozenById = new Map(frozen.map((rule) => [rule.id, rule]));
  const liveById = new Map(live.map((rule) => [rule.id, rule]));
  const items: DriftItem[] = [];

  for (const frozenRule of frozen) {
    const liveRule = liveById.get(frozenRule.id);
    if (!liveRule) {
      items.push({
        kind: "frozen_rule_missing",
        ruleId: frozenRule.id,
        frozenWording: frozenRule.wording,
      });
      continue;
    }

    const changes = collectChanges(frozenRule, liveRule);
    if (changes.length > 0) {
      items.push({
        kind: "definition_changed",
        ruleId: frozenRule.id,
        frozenWording: frozenRule.wording,
        liveWording: liveRule.wording,
        changes,
      });
    }
  }

  for (const liveRule of live) {
    if (!frozenById.has(liveRule.id)) {
      items.push({
        kind: "rules_added_outside_freeze",
        ruleId: liveRule.id,
        liveWording: liveRule.wording,
      });
    }
  }

  return items.sort((left, right) => left.ruleId.localeCompare(right.ruleId));
}

function collectChanges(
  frozenRule: HashableRule,
  liveRule: HashableRule,
): DriftChange[] {
  const changes: DriftChange[] = [];

  if (frozenRule.wording !== liveRule.wording) {
    changes.push("wording");
  }

  if (frozenRule.predicateFingerprint !== liveRule.predicateFingerprint) {
    changes.push("predicate");
  }

  if (frozenRule.matcherFingerprint !== liveRule.matcherFingerprint) {
    changes.push("matcher");
  }

  return changes;
}
