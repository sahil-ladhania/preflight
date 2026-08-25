/**
 * story-f — StoryHelpers factory + asset F (SEBI-06 unavailable).
 */
import { DETERMINISTIC_CATALOG } from "@preflight/rules";

import type { FindingSeed, StoryHelpers } from "./story-h.js";

const DEMO_OPERATOR = process.env.DEMO_OPERATOR_NAME ?? "Demo Operator";

function locateSpan(
  spanText: string,
  canonicalText: string,
): Array<{ start: number; end: number; text: string }> {
  const index = canonicalText.indexOf(spanText);
  if (index === -1) {
    return [];
  }

  return [{ start: index, end: index + spanText.length, text: spanText }];
}

function detMatcherSpans(
  ruleId: string,
  canonicalText: string,
): Array<{ start: number; end: number; text: string }> {
  const rule = DETERMINISTIC_CATALOG.find((entry) => entry.id === ruleId);
  return rule?.match(canonicalText).spans ?? [];
}

export function createStoryHelpers(): StoryHelpers {
  return {
    detPass(ruleId, machineAt) {
      return {
        ruleId,
        kind: "deterministic",
        evaluationStatus: "complete",
        machineVerdict: "pass",
        machineReason: "Rule satisfied.",
        spans: [],
        machineAt,
        humanVerdict: null,
        humanReason: null,
        humanActor: null,
        humanAt: null,
      };
    },
    detFail(ruleId, reason, canonicalText, machineAt) {
      return {
        ruleId,
        kind: "deterministic",
        evaluationStatus: "complete",
        machineVerdict: "fail",
        machineReason: reason,
        spans: detMatcherSpans(ruleId, canonicalText),
        machineAt,
        humanVerdict: null,
        humanReason: null,
        humanActor: null,
        humanAt: null,
      };
    },
    detFailWaived(ruleId, reason, canonicalText, machineAt, humanReason, humanAt) {
      return {
        ruleId,
        kind: "deterministic",
        evaluationStatus: "complete",
        machineVerdict: "fail",
        machineReason: reason,
        spans: detMatcherSpans(ruleId, canonicalText),
        machineAt,
        humanVerdict: "waived",
        humanReason,
        humanActor: DEMO_OPERATOR,
        humanAt,
      };
    },
    jdgPass(ruleId, machineAt) {
      return {
        ruleId,
        kind: "judgement",
        evaluationStatus: "complete",
        machineVerdict: "pass",
        machineReason: "No issue found.",
        spans: [],
        machineAt,
        humanVerdict: null,
        humanReason: null,
        humanActor: null,
        humanAt: null,
      };
    },
    jdgFailOpen(ruleId, reason, spanText, canonicalText, machineAt) {
      return {
        ruleId,
        kind: "judgement",
        evaluationStatus: "complete",
        machineVerdict: "fail",
        machineReason: reason,
        spans: locateSpan(spanText, canonicalText),
        machineAt,
        humanVerdict: null,
        humanReason: null,
        humanActor: null,
        humanAt: null,
      };
    },
    jdgFailConfirmed(
      ruleId,
      reason,
      spanText,
      canonicalText,
      machineAt,
      humanReason,
      humanAt,
    ) {
      return {
        ruleId,
        kind: "judgement",
        evaluationStatus: "complete",
        machineVerdict: "fail",
        machineReason: reason,
        spans: locateSpan(spanText, canonicalText),
        machineAt,
        humanVerdict: "confirmed",
        humanReason,
        humanActor: DEMO_OPERATOR,
        humanAt,
      };
    },
    jdgUnavailable(ruleId, reason, machineAt) {
      return {
        ruleId,
        kind: "judgement",
        evaluationStatus: "unavailable",
        machineVerdict: null,
        machineReason: reason,
        spans: [],
        machineAt,
        humanVerdict: null,
        humanReason: null,
        humanActor: null,
        humanAt: null,
      };
    },
    pendingShell(ruleId) {
      return {
        ruleId,
        kind: "judgement",
        evaluationStatus: "pending",
        machineVerdict: null,
        machineReason: null,
        spans: [],
        machineAt: null,
        humanVerdict: null,
        humanReason: null,
        humanActor: null,
        humanAt: null,
      };
    },
  };
}

export const ASSET_F_DEF = {
  letter: "f",
  id: "11111111-1111-4111-8111-111111111106",
  channel: "landing",
  copy: {
    headline: "Bluepeak Flexi Cap — landing page hero",
    body: "Build long-term wealth with a research-driven flexi cap approach.",
    disclaimer: "Mutual fund investments are subject to market risks.",
    cta: "Start investing",
  },
  generatedAt: "2026-03-14T14:00:00.000Z",
  regeneratedFromId: null,
  generationIndex: 1,
} as const;

export function buildFindingsF(_canonicalText: string, h: StoryHelpers): FindingSeed[] {
  return [
    h.detPass("SEBI-01", ASSET_F_DEF.generatedAt),
    h.detPass("SEBI-02", ASSET_F_DEF.generatedAt),
    h.jdgUnavailable(
      "SEBI-06",
      "Evaluation unavailable — span not found in asset. Deterministic results unaffected.",
      "2026-03-14T14:05:00.000Z",
    ),
  ];
}
