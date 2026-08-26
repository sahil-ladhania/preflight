/**
 * finding-decisions.service — append-only FindingDecision row builder.
 * Why: G-02 audit trail enrolled in verdict transactions.
 */
import type { Prisma } from "@prisma/client";
import type { DecisionAction, HumanVerdict } from "@preflight/schemas";

export interface RecordDecisionInput {
  findingId: string;
  action: DecisionAction;
  previousVerdict: HumanVerdict | null;
  verdict: HumanVerdict | null;
  reason: string | null;
  actor: string;
  at: Date;
}

export function buildDecisionRowData(
  input: RecordDecisionInput,
  id: string,
): Prisma.FindingDecisionCreateManyInput {
  return {
    id,
    findingId: input.findingId,
    action: input.action,
    previousVerdict: input.previousVerdict,
    verdict: input.verdict,
    reason: input.reason,
    actor: input.actor,
    at: input.at,
  };
}
