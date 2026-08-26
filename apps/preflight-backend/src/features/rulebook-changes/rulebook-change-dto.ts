/**
 * rulebook-change-dto — Prisma RulebookChange row → wire summary.
 * Why: shared mapper for rules list and mutation responses.
 */
import type { RulebookChange } from "@prisma/client";

import type { RulebookChangeSummaryDTO } from "@preflight/schemas";

import { toIso } from "../findings/finding-dto.js";

export function toRulebookChangeSummary(
  row: RulebookChange,
): RulebookChangeSummaryDTO {
  return {
    action: row.action as RulebookChangeSummaryDTO["action"],
    actor: row.actor,
    reason: row.reason,
    at: toIso(row.at),
  };
}
