/**
 * run-judgement-golden — 3 cases × 3 runs via live judge (07-build-order.md Phase 2.5).
 */
import dotenv from "dotenv";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { JudgeOutputSchema } from "@preflight/schemas";

import { buildJudgePrompt } from "../agents/judge.prompt.js";
import { FROZEN_WORDING } from "../prisma/seed/judgement-rules.js";

dotenv.config({
  path: path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../.env",
  ),
});

interface GoldenJudgementCase {
  snippet: string;
  ruleId: string;
  expected: "pass" | "fail";
  why: string;
}

const RUNS_PER_CASE = 3;

function stripJsonFence(content: string): string {
  const trimmed = content.trim();
  const match = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  return match?.[1]?.trim() ?? trimmed;
}

function loadCases(): GoldenJudgementCase[] {
  const goldenPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../packages/rules/golden/judgement.json",
  );
  return JSON.parse(readFileSync(goldenPath, "utf8")) as GoldenJudgementCase[];
}

async function main(): Promise<void> {
  const { runAgent } = await import("../src/lib/gitagent.js");
  const cases = loadCases();
  const flippingCaseIds: string[] = [];
  let agreementCount = 0;
  let totalRuns = 0;

  console.log("Judgement golden — 3 cases × 3 runs\n");

  for (const testCase of cases) {
    const wording = FROZEN_WORDING[testCase.ruleId as keyof typeof FROZEN_WORDING];
    if (!wording) {
      throw new Error(`Unknown ruleId in judgement golden: ${testCase.ruleId}`);
    }

    const verdicts: Array<"pass" | "fail"> = [];

    for (let run = 1; run <= RUNS_PER_CASE; run += 1) {
      const prompt = buildJudgePrompt({
        canonicalText: testCase.snippet,
        ruleWording: wording,
        ruleId: testCase.ruleId,
      });
      const { content } = await runAgent("judge", prompt, {
        timeoutMs: 120_000,
        judgeDeterminism: {
          canonicalText: testCase.snippet,
          ruleId: testCase.ruleId,
        },
      });
      const parsed = JudgeOutputSchema.parse(JSON.parse(stripJsonFence(content)));
      verdicts.push(parsed.verdict);
      totalRuns += 1;

      const matches = parsed.verdict === testCase.expected;
      if (matches) {
        agreementCount += 1;
      }

      console.log(
        `${testCase.ruleId} run ${run}: expected ${testCase.expected}, got ${parsed.verdict}${matches ? "" : " (miss)"}`,
      );
    }

    const uniqueVerdicts = new Set(verdicts);
    if (uniqueVerdicts.size > 1) {
      flippingCaseIds.push(`${testCase.ruleId} — ${testCase.why}`);
    }
  }

  const agreementRate =
    totalRuns === 0 ? 0 : Math.round((agreementCount / totalRuns) * 100);
  const varianceRate =
    cases.length === 0 ? 0 : Math.round((flippingCaseIds.length / cases.length) * 100);

  console.log("\n--- Summary ---");
  console.log(`Agreement: ${agreementCount}/${totalRuns} (${agreementRate}%)`);
  console.log(
    `Variance rate: ${flippingCaseIds.length}/${cases.length} cases (${varianceRate}%) — run-to-run flip within case`,
  );
  if (flippingCaseIds.length > 0) {
    console.log("Flipping cases:");
    for (const caseId of flippingCaseIds) {
      console.log(`- ${caseId}`);
    }
  } else {
    console.log("Flipping cases: none");
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("judgement golden failed:", message);
  process.exit(1);
});
