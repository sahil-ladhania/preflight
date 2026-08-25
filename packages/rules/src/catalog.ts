/**
 * catalog — deterministic rule defs exported for backend merge.
 * Why: package det wording + matchers; judgement lives in Postgres (03).
 */
import type { StructuredBrief } from "./structured-brief.js";
import type { MatcherResult } from "./span.js";
import { sha256Hex } from "./lib/sha256.js";
import { matchDisclaimer, DISCLAIMER_MATCHER_VERSION } from "./matchers/disclaimer.js";
import { matchSchemeName, SCHEME_NAME_MATCHER_VERSION } from "./matchers/scheme-name.js";
import { matchCagr, CAGR_MATCHER_VERSION } from "./matchers/cagr.js";
import {
  matchBannedPhrase,
  BANNED_PHRASE_MATCHER_VERSION,
} from "./matchers/banned-phrase.js";
import {
  matchPerformanceSubstantiation,
  PERFORMANCE_SUBSTANTIATION_MATCHER_VERSION,
} from "./matchers/performance-substantiation.js";
import {
  appliesSebi01,
  appliesSebi02,
  appliesSebi03,
  appliesSebi04,
  appliesSebi05,
} from "./predicates.js";

export interface DeterministicRule {
  id: string;
  wording: string;
  kind: "deterministic";
  applies: (brief: StructuredBrief) => boolean;
  match: (canonicalText: string) => MatcherResult;
}

function predicateFingerprint(source: string): string {
  return sha256Hex(source);
}

function matcherFingerprint(version: string): string {
  return sha256Hex(version);
}

export const DETERMINISTIC_CATALOG: DeterministicRule[] = [
  {
    id: "SEBI-01",
    wording: "Standard risk disclaimer must appear in the asset copy.",
    kind: "deterministic",
    applies: appliesSebi01,
    match: matchDisclaimer,
  },
  {
    id: "SEBI-02",
    wording: "Scheme name must appear on first mention.",
    kind: "deterministic",
    applies: appliesSebi02,
    match: matchSchemeName,
  },
  {
    id: "SEBI-03",
    wording: "CAGR claims must name the period.",
    kind: "deterministic",
    applies: appliesSebi03,
    match: matchCagr,
  },
  {
    id: "SEBI-04",
    wording: "Banned promotional phrases are not permitted.",
    kind: "deterministic",
    applies: appliesSebi04,
    match: matchBannedPhrase,
  },
  {
    id: "SEBI-05",
    wording: "Performance figures require substantiation and period disclosure.",
    kind: "deterministic",
    applies: appliesSebi05,
    match: matchPerformanceSubstantiation,
  },
];

export function getDeterministicCatalog(): DeterministicRule[] {
  return DETERMINISTIC_CATALOG;
}

export function getDeterministicRuleById(
  ruleId: string,
): DeterministicRule | undefined {
  return DETERMINISTIC_CATALOG.find((rule) => rule.id === ruleId);
}

export function isDeterministicRuleId(ruleId: string): boolean {
  return DETERMINISTIC_CATALOG.some((rule) => rule.id === ruleId);
}

export const DETERMINISTIC_PREDICATE_FINGERPRINTS: Record<string, string> = {
  "SEBI-01": predicateFingerprint("appliesSebi01"),
  "SEBI-02": predicateFingerprint("appliesSebi02"),
  "SEBI-03": predicateFingerprint("appliesSebi03"),
  "SEBI-04": predicateFingerprint("appliesSebi04"),
  "SEBI-05": predicateFingerprint("appliesSebi05"),
};

export const DETERMINISTIC_MATCHER_FINGERPRINTS: Record<string, string> = {
  "SEBI-01": matcherFingerprint(DISCLAIMER_MATCHER_VERSION),
  "SEBI-02": matcherFingerprint(SCHEME_NAME_MATCHER_VERSION),
  "SEBI-03": matcherFingerprint(CAGR_MATCHER_VERSION),
  "SEBI-04": matcherFingerprint(BANNED_PHRASE_MATCHER_VERSION),
  "SEBI-05": matcherFingerprint(PERFORMANCE_SUBSTANTIATION_MATCHER_VERSION),
};
