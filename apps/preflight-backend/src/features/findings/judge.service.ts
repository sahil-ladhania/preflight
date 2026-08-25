/**
 * judge.service — judge fan-out and retry.
 * Why: one query() + indexOf span locate + persist.
 */
import type { JudgeOutput, Span } from "@preflight/schemas";
import { JudgeOutputSchema } from "@preflight/schemas";

import { buildJudgePrompt } from "../../../agents/judge.prompt.js";
import { prisma } from "../../lib/prisma.js";
import { loadSnapshotWording } from "./finding-dto.js";

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

async function persistUnavailable(findingId: string, reason: string): Promise<void> {
  await prisma.finding.update({
    where: { id: findingId },
    data: {
      evaluationStatus: "unavailable",
      machineVerdict: null,
      machineReason: reason,
      spans: [],
      machineAt: new Date(),
    },
  });
}

async function persistJudgeResult(
  findingId: string,
  output: JudgeOutput,
  canonicalText: string,
): Promise<void> {
  const now = new Date();

  if (output.verdict === "pass") {
    await prisma.finding.update({
      where: { id: findingId },
      data: {
        evaluationStatus: "complete",
        machineVerdict: "pass",
        machineReason: output.reason,
        spans: [],
        machineAt: now,
      },
    });
    return;
  }

  if (!output.spanText) {
    await prisma.finding.update({
      where: { id: findingId },
      data: {
        evaluationStatus: "complete",
        machineVerdict: "fail",
        machineReason: output.reason,
        spans: [],
        machineAt: now,
      },
    });
    return;
  }

  const spans = locateSpan(output.spanText, canonicalText);

  if (!spans) {
    await prisma.finding.update({
      where: { id: findingId },
      data: {
        evaluationStatus: "unavailable",
        machineVerdict: null,
        machineReason: output.reason,
        spans: [],
        machineAt: now,
      },
    });
    return;
  }

  await prisma.finding.update({
    where: { id: findingId },
    data: {
      evaluationStatus: "complete",
      machineVerdict: "fail",
      machineReason: output.reason,
      spans,
      machineAt: now,
    },
  });
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

    const results = await Promise.allSettled(
      findings.map((finding) => evaluateFinding(finding.id)),
    );

    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Judge fan-out task rejected:", result.reason);
      }
    }
  })();
}

export async function evaluateFinding(findingId: string): Promise<void> {
  try {
    const finding = await prisma.finding.findUnique({ where: { id: findingId } });

    if (!finding || finding.kind !== "judgement") {
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
    const { content } = await runAgent("judge", prompt);
    const output = parseJudgeOutput(content);

    await persistJudgeResult(findingId, output, asset.canonicalText);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Judge evaluation failed.";

    try {
      await persistUnavailable(findingId, message);
    } catch (persistError) {
      console.error("Failed to persist unavailable judge result:", persistError);
    }
  }
}
