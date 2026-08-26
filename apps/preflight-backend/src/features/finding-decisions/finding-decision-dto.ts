/**
 * finding-decision-dto — Prisma FindingDecision row → wire DTO.
 * Why: shared mapper for assets and findings services.
 */
import type { FindingDecision } from "@prisma/client";

import type { FindingDecisionDTO } from "@preflight/schemas";

import { toIso } from "../findings/finding-dto.js";

export function toFindingDecisionDTO(row: FindingDecision): FindingDecisionDTO {
  return {
    id: row.id,
    action: row.action as FindingDecisionDTO["action"],
    previousVerdict: row.previousVerdict as FindingDecisionDTO["previousVerdict"],
    verdict: row.verdict as FindingDecisionDTO["verdict"],
    reason: row.reason,
    actor: row.actor,
    at: toIso(row.at),
  };
}
