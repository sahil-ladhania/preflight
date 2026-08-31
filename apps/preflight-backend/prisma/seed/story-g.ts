/**
 * story-g — compile snapshot + runHash helpers + asset G.
 */
import { createHash } from "node:crypto";

import {
  DETERMINISTIC_CATALOG,
  DETERMINISTIC_MATCHER_FINGERPRINTS,
  DETERMINISTIC_PREDICATE_FINGERPRINTS,
  type HashableRule,
  type PredicateSpec,
} from "@preflight/rules";

import { FROZEN_WORDING } from "./judgement-rules.js";
import { buildFullFindings, type JudgementStory } from "./story-findings.js";
import type { AssetSeedDef, FindingSeed, StoryHelpers } from "./story-h.js";

const JUDGEMENT_SPECS: Record<string, PredicateSpec> = {
  "SEBI-06": { field: "claims", op: "in", value: ["performance", "returns"] },
  "BRAND-02": { field: "channels", op: "in", value: ["linkedin", "email"] },
  "BRAND-03": {
    field: "claims",
    op: "in",
    value: ["differentiation", "market-leading"],
  },
  "BRAND-05": { field: "channels", op: "equals", value: "whatsapp" },
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

export const ASSET_G_DEF: AssetSeedDef = {
  letter: "g",
  id: "11111111-1111-4111-8111-111111111107",
  channel: "whatsapp",
  copy: {
    headline: "Bluepeak Flexi Cap — WhatsApp broadcast",
    body: "Bluepeak Flexi Cap is the only fund you will ever need for disciplined long-term results.",
    disclaimer: "Mutual fund investments are subject to market risks.",
    cta: "Open account",
  },
  generatedAt: "2026-03-14T16:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
};

const JDG_STORY: JudgementStory = {
  "SEBI-06": { kind: "pass" },
  "BRAND-02": { kind: "pass" },
  "BRAND-03": {
    kind: "open",
    reason: "Copy overstates fund differentiation.",
    spanText: "only fund you will ever need",
    machineAt: "2026-03-14T16:05:00.000Z",
  },
};

export function buildFindingsG(
  canonicalText: string,
  h: StoryHelpers,
): FindingSeed[] {
  return buildFullFindings(ASSET_G_DEF, canonicalText, h, JDG_STORY);
}
