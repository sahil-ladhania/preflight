/**
 * story-findings — engine-backed det rows + hand-written judgement story.
 * Why: full freeze pin per asset; runHash must match live re-run (Fix 1 / N2).
 */
// size: detRunRules + computeRunHash + buildFullFindings; seed verify script imports this module
import {
  DETERMINISTIC_CATALOG,
  DETERMINISTIC_MATCHER_FINGERPRINTS,
  DETERMINISTIC_PREDICATE_FINGERPRINTS,
  hashRun,
  runDeterministic,
  type DetFinding,
  type DetRunRule,
} from "@preflight/rules";

import type { AssetSeedDef, FindingSeed, StoryHelpers } from "./story-h.js";

export const FREEZE_FINDING_COUNT = 8;

export function detRunRules(): DetRunRule[] {
  return DETERMINISTIC_CATALOG.map((rule) => ({
    id: rule.id,
    kind: "deterministic" as const,
    wording: rule.wording,
    predicateFingerprint: DETERMINISTIC_PREDICATE_FINGERPRINTS[rule.id] ?? "",
    matcherFingerprint: DETERMINISTIC_MATCHER_FINGERPRINTS[rule.id] ?? "",
    match: rule.match,
  }));
}

export function computeRunHash(canonicalText: string, rulesetHash: string): string {
  const { findings } = runDeterministic({
    canonicalText,
    rules: detRunRules(),
  });

  const matcherOutputs = findings.map((finding) => ({
    ruleId: finding.ruleId,
    machineVerdict: finding.machineVerdict,
    spans: finding.spans,
  }));

  return hashRun({ canonicalText, rulesetHash, matcherOutputs });
}

export interface DetWaiveOverride {
  ruleId: string;
  humanReason: string;
  humanAt: string;
}

export type JudgementStoryRow =
  | { kind: "pass" }
  | {
      kind: "open";
      reason: string;
      spanText: string;
      machineAt: string;
    }
  | {
      kind: "confirmed";
      reason: string;
      spanText: string;
      machineAt: string;
      humanReason: string;
      humanAt: string;
    }
  | {
      kind: "unavailable";
      reason: string;
      machineAt: string;
    };

export type JudgementStory = Record<
  "SEBI-06" | "BRAND-02" | "BRAND-03",
  JudgementStoryRow
>;

function detFindingToSeed(
  finding: DetFinding,
  canonicalText: string,
  machineAt: string,
  h: StoryHelpers,
  waive?: DetWaiveOverride,
): FindingSeed {
  if (finding.machineVerdict === "fail") {
    if (waive?.ruleId === finding.ruleId) {
      return h.detFailWaived(
        finding.ruleId,
        finding.machineReason ?? "Rule failed.",
        canonicalText,
        machineAt,
        waive.humanReason,
        waive.humanAt,
      );
    }

    return h.detFail(
      finding.ruleId,
      finding.machineReason ?? "Rule failed.",
      canonicalText,
      machineAt,
    );
  }

  return h.detPass(finding.ruleId, machineAt);
}

export function buildDetFindingsFromEngine(
  canonicalText: string,
  machineAt: string,
  h: StoryHelpers,
  waive?: DetWaiveOverride,
): FindingSeed[] {
  const { findings } = runDeterministic({
    canonicalText,
    rules: detRunRules(),
  });

  return findings.map((finding) =>
    detFindingToSeed(finding, canonicalText, machineAt, h, waive),
  );
}

function buildJudgementFindings(
  canonicalText: string,
  machineAt: string,
  h: StoryHelpers,
  story: JudgementStory,
): FindingSeed[] {
  const rows: FindingSeed[] = [];

  for (const ruleId of ["SEBI-06", "BRAND-02", "BRAND-03"] as const) {
    const row = story[ruleId];

    if (row.kind === "pass") {
      rows.push(h.jdgPass(ruleId, machineAt));
      continue;
    }

    if (row.kind === "unavailable") {
      rows.push(h.jdgUnavailable(ruleId, row.reason, row.machineAt));
      continue;
    }

    if (row.kind === "open") {
      rows.push(
        h.jdgFailOpen(
          ruleId,
          row.reason,
          row.spanText,
          canonicalText,
          row.machineAt,
        ),
      );
      continue;
    }

    rows.push(
      h.jdgFailConfirmed(
        ruleId,
        row.reason,
        row.spanText,
        canonicalText,
        row.machineAt,
        row.humanReason,
        row.humanAt,
      ),
    );
  }

  return rows;
}

export function buildFullFindings(
  def: AssetSeedDef,
  canonicalText: string,
  h: StoryHelpers,
  judgementStory: JudgementStory,
  detWaive?: DetWaiveOverride,
): FindingSeed[] {
  const det = buildDetFindingsFromEngine(
    canonicalText,
    def.generatedAt,
    h,
    detWaive,
  );
  const jdg = buildJudgementFindings(
    canonicalText,
    def.generatedAt,
    h,
    judgementStory,
  );

  const findings = [...det, ...jdg].sort((left, right) =>
    left.ruleId.localeCompare(right.ruleId),
  );

  if (findings.length !== FREEZE_FINDING_COUNT) {
    throw new Error(
      `Seed asset ${def.letter.toUpperCase()} has ${findings.length} findings; expected ${FREEZE_FINDING_COUNT}.`,
    );
  }

  return findings;
}

export function runDetEngine(canonicalText: string): DetFinding[] {
  const { findings } = runDeterministic({
    canonicalText,
    rules: detRunRules(),
  });

  return findings;
}
