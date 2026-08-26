/**
 * agent-run-dto — Prisma AgentRun row → wire summary.
 * Why: shared mapper for assets and findings detail DTOs.
 */
import type { AgentRun } from "@prisma/client";

import type { AgentRunSummaryDTO } from "@preflight/schemas";

import { toIso } from "../findings/finding-dto.js";

export function toAgentRunSummary(row: AgentRun | null): AgentRunSummaryDTO | null {
  if (row === null) {
    return null;
  }

  return {
    id: row.id,
    agentName: row.agentName as AgentRunSummaryDTO["agentName"],
    agentDefVersion: row.agentDefVersion,
    model: row.model,
    inputTokens: row.inputTokens,
    outputTokens: row.outputTokens,
    totalTokens: row.totalTokens,
    costUsd: row.costUsd,
    latencyMs: row.latencyMs,
    occurredAt: toIso(row.occurredAt),
    ok: row.ok,
    errorKind: row.errorKind,
  };
}
