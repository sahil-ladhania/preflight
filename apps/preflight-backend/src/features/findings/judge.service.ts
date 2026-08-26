/**
 * judge.service — judge fan-out and retry.
 * Why: one query() + indexOf span locate + persist.
 */
import type { Prisma } from "@prisma/client";
import type { JudgeOutput, Span } from "@preflight/schemas";
import { JudgeOutputSchema } from "@preflight/schemas";

import { buildJudgePrompt } from "../../../agents/judge.prompt.js";
import { prisma } from "../../lib/prisma.js";
import { loadSnapshotWording } from "./finding-dto.js";
import { recordAgentRun } from "../agent-runs/agent-runs.service.js";
import { AgentInvocationError, hashAgentText } from "../../lib/gitagent.js";

const JUDGE_FAN_OUT_CONCURRENCY = 3;

function stripJsonFence(content: string): string {
  const trimmed = content.trim();
  const match = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  return match?.[1]?.trim() ?? trimmed;
}

function parseJudgeOutput(content: string): JudgeOutput {
  let parsed: unknown;

  try {
    parsed = JSON.parse(stripJsonFence(content));
  } catch {
    throw new Error("Judge returned invalid JSON.");
  }

  return JudgeOutputSchema.parse(parsed);
}

function locateSpan(spanText: string, canonicalText: string): Span[] | null {
  const index = canonicalText.indexOf(spanText);

  if (index === -1) {
    return null;
  }

  const slice = canonicalText.slice(index, index + spanText.length);

  if (slice !== spanText) {
    return null;
  }

  return [{ start: index, end: index + spanText.length, text: spanText }];
}

async function persistIfPending(
  findingId: string,
  data: Prisma.FindingUncheckedUpdateManyInput,
): Promise<boolean> {
  const result = await prisma.finding.updateMany({
    where: { id: findingId, evaluationStatus: "pending" },
    data,
  });

  return result.count > 0;
}

async function persistUnavailable(
  findingId: string,
  reason: string,
  judgeRunId: string | null,
): Promise<void> {
  await persistIfPending(findingId, {
    evaluationStatus: "unavailable",
    machineVerdict: null,
    machineReason: reason,
    spans: [],
    machineAt: new Date(),
    judgeRunId,
  });
}

async function persistJudgeResult(
  findingId: string,
  output: JudgeOutput,
  canonicalText: string,
  judgeRunId: string | null,
): Promise<void> {
  const now = new Date();

  if (output.verdict === "pass") {
    await persistIfPending(findingId, {
      evaluationStatus: "complete",
      machineVerdict: "pass",
      machineReason: output.reason,
      spans: [],
      machineAt: now,
      judgeRunId,
    });
    return;
  }

  if (!output.spanText) {
    await persistIfPending(findingId, {
      evaluationStatus: "complete",
      machineVerdict: "fail",
      machineReason: output.reason,
      spans: [],
      machineAt: now,
      judgeRunId,
    });
    return;
  }

  const spans = locateSpan(output.spanText, canonicalText);

  if (!spans) {
    await persistIfPending(findingId, {
      evaluationStatus: "unavailable",
      machineVerdict: null,
      machineReason: output.reason,
      spans: [],
      machineAt: now,
      judgeRunId,
    });
    return;
  }

  await persistIfPending(findingId, {
    evaluationStatus: "complete",
    machineVerdict: "fail",
    machineReason: output.reason,
    spans,
    machineAt: now,
    judgeRunId,
  });
}

async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  if (items.length === 0) {
    return;
  }

  const queue = [...items];
  const poolSize = Math.min(concurrency, queue.length);

  await Promise.all(
    Array.from({ length: poolSize }, async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (item === undefined) {
          return;
        }

        try {
          await worker(item);
        } catch (error: unknown) {
          console.error("Judge fan-out task rejected:", error);
        }
      }
    }),
  );
}

export function fanOutJudgement(assetIds: string[]): void {
  void (async (): Promise<void> => {
    const findings = await prisma.finding.findMany({
      where: {
        assetId: { in: assetIds },
        kind: "judgement",
        evaluationStatus: "pending",
      },
      select: { id: true },
    });

    await runWithConcurrency(findings, JUDGE_FAN_OUT_CONCURRENCY, (finding) =>
      evaluateFinding(finding.id),
    );
  })();
}

export async function evaluateFinding(findingId: string): Promise<void> {
  try {
    const finding = await prisma.finding.findUnique({ where: { id: findingId } });

    if (!finding || finding.kind !== "judgement") {
      return;
    }

    if (finding.evaluationStatus !== "pending") {
      return;
    }

    const asset = await prisma.asset.findUnique({ where: { id: finding.assetId } });

    if (!asset) {
      return;
    }

    const ruleWording = await loadSnapshotWording(asset.constraintSetId, finding.ruleId);
    const prompt = buildJudgePrompt({
      canonicalText: asset.canonicalText,
      ruleWording,
      ruleId: finding.ruleId,
    });
    const { runAgent } = await import("../../lib/gitagent.js");
    let judgeRunId: string | null = null;

    try {
      const { content, meta } = await runAgent("judge", prompt, {
        judgeDeterminism: {
          canonicalText: asset.canonicalText,
          ruleId: finding.ruleId,
        },
      });

      try {
        const output = parseJudgeOutput(content);
        judgeRunId = await recordAgentRun(meta, { kind: "finding", id: findingId });
        await persistJudgeResult(findingId, output, asset.canonicalText, judgeRunId);
      } catch {
        const failedMeta = {
          ...meta,
          ok: false,
          errorKind: "parse_failed",
          output: content,
          outputHash: hashAgentText(content),
        };
        judgeRunId = await recordAgentRun(failedMeta, { kind: "finding", id: findingId });
        await persistUnavailable(findingId, "Judge returned invalid JSON.", judgeRunId);
      }
    } catch (error) {
      if (error instanceof AgentInvocationError) {
        judgeRunId = await recordAgentRun(error.meta, { kind: "finding", id: findingId });
        await persistUnavailable(findingId, error.message, judgeRunId);
        return;
      }

      throw error;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Judge evaluation failed.";

    try {
      await persistUnavailable(findingId, message, null);
    } catch (persistError) {
      console.error("Failed to persist unavailable judge result:", persistError);
    }
  }
}
