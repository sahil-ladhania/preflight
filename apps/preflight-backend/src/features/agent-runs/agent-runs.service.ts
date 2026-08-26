/**
 * agent-runs.service — append-only AgentRun persistence.
 * Why: G-01 governance trace; sole writer of AgentRun rows.
 */
import { randomUUID } from "node:crypto";

import type { AgentRunMeta } from "../../lib/gitagent.js";
import { prisma } from "../../lib/prisma.js";

const PREVIEW_MAX = 500;

export interface AgentRunLinkage {
  kind: "asset" | "finding" | "campaign" | "chat";
  id: string | null;
}

function truncatePreview(text: string): string {
  if (text.length <= PREVIEW_MAX) {
    return text;
  }

  return text.slice(0, PREVIEW_MAX);
}

export function buildAgentRunRowData(
  meta: AgentRunMeta,
  linkage: AgentRunLinkage,
  id: string,
) {
  return {
    id,
    agentName: meta.agentName,
    agentDefVersion: meta.agentDefVersion,
    model: meta.model,
    linkageKind: linkage.kind,
    linkageId: linkage.id,
    promptHash: meta.promptHash,
    outputHash: meta.outputHash,
    promptPreview: truncatePreview(meta.prompt),
    outputPreview: truncatePreview(meta.output),
    inputTokens: meta.inputTokens,
    outputTokens: meta.outputTokens,
    totalTokens: meta.totalTokens,
    costUsd: meta.costUsd,
    latencyMs: meta.latencyMs,
    skillsRead: meta.skillsRead,
    injectionSignals: [] as string[],
    chatFlags: [] as string[],
    ok: meta.ok,
    errorKind: meta.errorKind,
  };
}

export async function recordAgentRun(
  meta: AgentRunMeta,
  linkage: AgentRunLinkage,
): Promise<string | null> {
  try {
    const row = await prisma.agentRun.create({
      data: buildAgentRunRowData(meta, linkage, randomUUID()),
      select: { id: true },
    });

    return row.id;
  } catch (error: unknown) {
    console.error("recordAgentRun failed:", error);
    return null;
  }
}
