/**
 * generate-revision — parent copy + machine failures for regen prompt.
 * Why: regen must revise, not blind retry (doc 05/06 machine-only feedback).
 */
import type { RuleKind } from "@preflight/schemas";

import { prisma } from "../../lib/prisma.js";

export interface RegenFailureRow {
  ruleId: string;
  kind: RuleKind;
  machineReason: string;
  spanText: string | null;
}

export interface RegenRevisionContext {
  priorCanonicalText: string;
  failures: RegenFailureRow[];
}

function spanTextFromFinding(spans: unknown): string | null {
  if (!Array.isArray(spans) || spans.length === 0) {
    return null;
  }

  const first = spans[0];
  if (
    typeof first !== "object" ||
    first === null ||
    !("text" in first) ||
    typeof first.text !== "string"
  ) {
    return null;
  }

  return first.text;
}

export async function loadRegenRevisionContext(
  regeneratedFromId: string,
): Promise<RegenRevisionContext | null> {
  const parent = await prisma.asset.findUnique({
    where: { id: regeneratedFromId },
    include: {
      findings: {
        where: {
          evaluationStatus: "complete",
          machineVerdict: "fail",
        },
      },
    },
  });

  if (!parent) {
    return null;
  }

  return {
    priorCanonicalText: parent.canonicalText,
    failures: parent.findings.map((finding) => ({
      ruleId: finding.ruleId,
      kind: finding.kind as RuleKind,
      machineReason: finding.machineReason ?? "Rule failed.",
      spanText: spanTextFromFinding(finding.spans),
    })),
  };
}
