/**
 * catalog — live catalog merge.
 * Why: package det ∪ JudgementRule rows for compile, rerun, rules.
 */
import { createHash } from "node:crypto";

import {
  DETERMINISTIC_CATALOG,
  DETERMINISTIC_MATCHER_FINGERPRINTS,
  DETERMINISTIC_PREDICATE_FINGERPRINTS,
  getDeterministicRuleById,
  isDeterministicRuleId as isPackageDeterministicRuleId,
  type DeterministicRule,
  type HashableRule,
} from "@preflight/rules";
import { PredicateSpecSchema, type PredicateSpec, type RuleCatalogRowDTO } from "@preflight/schemas";

import { prisma } from "./prisma.js";

interface LiveCatalogEntry {
  ruleId: string;
  kind: "deterministic" | "judgement";
  wording: string;
  applies?: DeterministicRule["applies"];
  match?: DeterministicRule["match"];
  predicateSpec?: PredicateSpec;
}

function hashPredicateSpec(spec: PredicateSpec): string {
  return createHash("sha256").update(JSON.stringify(spec)).digest("hex");
}

function sortCatalogEntries(entries: LiveCatalogEntry[]): LiveCatalogEntry[] {
  const deterministic = entries
    .filter((entry) => entry.kind === "deterministic")
    .sort((left, right) => left.ruleId.localeCompare(right.ruleId));
  const judgement = entries
    .filter((entry) => entry.kind === "judgement")
    .sort((left, right) => left.ruleId.localeCompare(right.ruleId));

  return [...deterministic, ...judgement];
}

export async function getLiveCatalog(): Promise<LiveCatalogEntry[]> {
  const judgementRows = await prisma.judgementRule.findMany({
    orderBy: { id: "asc" },
  });

  const entries: LiveCatalogEntry[] = [
    ...DETERMINISTIC_CATALOG.map((rule) => ({
      ruleId: rule.id,
      kind: "deterministic" as const,
      wording: rule.wording,
      applies: rule.applies,
      match: rule.match,
    })),
    ...judgementRows.map((row) => ({
      ruleId: row.id,
      kind: "judgement" as const,
      wording: row.wording,
      predicateSpec: PredicateSpecSchema.parse(row.predicateSpec),
    })),
  ];

  return sortCatalogEntries(entries);
}

export function isDeterministicRuleId(ruleId: string): boolean {
  return isPackageDeterministicRuleId(ruleId);
}

export function toHashableRules(entries: LiveCatalogEntry[]): HashableRule[] {
  return entries.map((entry) => {
    if (entry.kind === "deterministic") {
      return {
        id: entry.ruleId,
        kind: "deterministic",
        wording: entry.wording,
        predicateFingerprint: DETERMINISTIC_PREDICATE_FINGERPRINTS[entry.ruleId] ?? "",
        matcherFingerprint: DETERMINISTIC_MATCHER_FINGERPRINTS[entry.ruleId] ?? "",
      };
    }

    return {
      id: entry.ruleId,
      kind: "judgement",
      wording: entry.wording,
      predicateFingerprint: entry.predicateSpec
        ? hashPredicateSpec(entry.predicateSpec)
        : "",
      matcherFingerprint: null,
    };
  });
}

function formatApplicabilitySummary(spec: PredicateSpec): string {
  if (spec.op === "in") {
    return `${spec.field} in ${spec.value.join(", ")}`;
  }

  return `${spec.field} equals ${spec.value}`;
}

export function toRuleCatalogRow(entry: LiveCatalogEntry): RuleCatalogRowDTO {
  if (entry.kind === "deterministic") {
    return {
      ruleId: entry.ruleId,
      kind: "deterministic",
      wording: entry.wording,
      predicateSpec: null,
      applicabilitySummary: null,
      editable: false,
    };
  }

  return {
    ruleId: entry.ruleId,
    kind: "judgement",
    wording: entry.wording,
    predicateSpec: entry.predicateSpec ?? null,
    applicabilitySummary: entry.predicateSpec
      ? formatApplicabilitySummary(entry.predicateSpec)
      : null,
    editable: true,
  };
}

export function getPackageMatch(
  ruleId: string,
): DeterministicRule["match"] | undefined {
  return getDeterministicRuleById(ruleId)?.match;
}
