/**
 * story-g — compile snapshot + runHash helpers + asset G.
 */
import { createHash } from "node:crypto";

import {
  DETERMINISTIC_CATALOG,
  DETERMINISTIC_MATCHER_FINGERPRINTS,
  DETERMINISTIC_PREDICATE_FINGERPRINTS,
  hashRun,
  runDeterministic,
  type DetRunRule,
  type HashableRule,
  type PredicateSpec,
} from "@preflight/rules";

import { FROZEN_WORDING } from "./judgement-rules.js";
import type { AssetSeedDef, FindingSeed, StoryHelpers } from "./story-h.js";

const JUDGEMENT_SPECS: Record<string, PredicateSpec> = {
  "SEBI-06": { field: "claims", op: "in", value: ["performance", "returns"] },
  "BRAND-02": { field: "channels", op: "in", value: ["linkedin", "email"] },
  "BRAND-03": {
    field: "claims",
    op: "in",
    value: ["differentiation", "market-leading"],
  },
};

function hashPredicateSpec(spec: PredicateSpec): string {
  return createHash("sha256").update(JSON.stringify(spec)).digest("hex");
}

function detWording(ruleId: string): string {
  if (ruleId === "SEBI-05") {
    return FROZEN_WORDING["SEBI-05"];
  }

  return (
    DETERMINISTIC_CATALOG.find((rule) => rule.id === ruleId)?.wording ?? ruleId
  );
}

export function buildSnapshots(freezeRuleIds: readonly string[]): HashableRule[] {
  return freezeRuleIds.map((ruleId) => {
    const isDet = ruleId.startsWith("SEBI-") && ruleId !== "SEBI-06";

    if (isDet) {
      return {
        id: ruleId,
        kind: "deterministic" as const,
        wording: detWording(ruleId),
        predicateFingerprint: DETERMINISTIC_PREDICATE_FINGERPRINTS[ruleId] ?? "",
        matcherFingerprint: DETERMINISTIC_MATCHER_FINGERPRINTS[ruleId] ?? "",
      };
    }

    const spec = JUDGEMENT_SPECS[ruleId];
    return {
      id: ruleId,
      kind: "judgement" as const,
      wording: FROZEN_WORDING[ruleId as keyof typeof FROZEN_WORDING],
      predicateFingerprint: spec ? hashPredicateSpec(spec) : "",
      matcherFingerprint: null,
    };
  });
}

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

export function computeRunHash(canonicalText: string, rulesetHash: string): string {
  const { matcherOutputs } = runDeterministic({
    canonicalText,
    rules: detRunRules(),
  });

  return hashRun({ canonicalText, rulesetHash, matcherOutputs });
}

export const ASSET_G_DEF: AssetSeedDef = {
  letter: "g",
  id: "11111111-1111-4111-8111-111111111107",
  channel: "whatsapp",
  copy: {
    headline: "Bluepeak Flexi Cap — WhatsApp broadcast",
    body: "Bluepeak Flexi Cap is the only fund you will ever need for market-beating results.",
    disclaimer: "Mutual fund investments are subject to market risks.",
    cta: "Open account",
  },
  generatedAt: "2026-03-14T16:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
};

export function buildFindingsG(
  canonicalText: string,
  h: StoryHelpers,
): FindingSeed[] {
  return [
    h.detPass("SEBI-01", ASSET_G_DEF.generatedAt),
    h.detPass("SEBI-02", ASSET_G_DEF.generatedAt),
    h.jdgFailOpen(
      "BRAND-03",
      "Copy overstates fund differentiation.",
      "only fund you will ever need",
      canonicalText,
      "2026-03-14T16:05:00.000Z",
    ),
  ];
}
