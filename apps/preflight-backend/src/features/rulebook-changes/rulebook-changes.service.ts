/**
 * rulebook-changes.service — append-only RulebookChange row builder.
 * Why: G-04 audit trail enrolled in rules transactions.
 */
import type { Prisma } from "@prisma/client";
import type { RulebookChangeAction } from "@preflight/schemas";

export interface RecordRulebookChangeInput {
  ruleId: string;
  action: RulebookChangeAction;
  prevWording: string | null;
  nextWording: string | null;
  prevPredicateSpec: Prisma.InputJsonValue | null;
  nextPredicateSpec: Prisma.InputJsonValue | null;
  actor: string;
  reason: string;
  at: Date;
}

export function buildRulebookChangeRowData(
  input: RecordRulebookChangeInput,
  id: string,
): Prisma.RulebookChangeCreateManyInput {
  return {
    id,
    ruleId: input.ruleId,
    action: input.action,
    prevWording: input.prevWording,
    nextWording: input.nextWording,
    prevPredicateSpec: input.prevPredicateSpec ?? undefined,
    nextPredicateSpec: input.nextPredicateSpec ?? undefined,
    actor: input.actor,
    reason: input.reason,
    at: input.at,
  };
}
