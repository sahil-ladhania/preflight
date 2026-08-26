/**
 * run-judgement-golden — live judge eval (07-build-order.md Phase 2.5, G-08).
 */
import dotenv from "dotenv";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { JudgeOutputSchema } from "@preflight/schemas";

import { buildJudgePrompt } from "../agents/judge.prompt.js";
import { FROZEN_WORDING } from "../prisma/seed/judgement-rules.js";
import {
  AGENT_EVAL_TIMEOUT_MS,
  buildEvalReport,
  JUDGEMENT_AGREEMENT_THRESHOLD,
  RUNS_PER_CASE,
  resolveEvalModel,
  stripJsonFence,
  writeEvalReport,
  type JudgementCaseReport,
  type JudgementEvalResult,
} from "./eval-shared.js";

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

export function loadJudgementCases(): GoldenJudgementCase[] {
  const goldenPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../packages/rules/golden/judgement.json",
  );
  return JSON.parse(readFileSync(goldenPath, "utf8")) as GoldenJudgementCase[];
}

export async function runJudgementEval(): Promise<JudgementEvalResult> {
  const { runAgent } = await import("../src/lib/gitagent.js");
  const cases = loadJudgementCases();
  const flippingCases: string[] = [];
  const caseReports: JudgementCaseReport[] = [];
  let agreementCount = 0;
  let totalRuns = 0;

  for (const testCase of cases) {
    const wording = FROZEN_WORDING[testCase.ruleId as keyof typeof FROZEN_WORDING];
    if (!wording) {
      throw new Error(`Unknown ruleId in judgement golden: ${testCase.ruleId}`);
    }

    const verdicts: Array<"pass" | "fail"> = [];
    let caseAgreement = 0;

    for (let run = 1; run <= RUNS_PER_CASE; run += 1) {
      const prompt = buildJudgePrompt({
        canonicalText: testCase.snippet,
        ruleWording: wording,
        ruleId: testCase.ruleId,
      });
      const { content } = await runAgent("judge", prompt, {
        timeoutMs: AGENT_EVAL_TIMEOUT_MS,
        judgeDeterminism: {
          canonicalText: testCase.snippet,
          ruleId: testCase.ruleId,
        },
      });
      const parsed = JudgeOutputSchema.parse(JSON.parse(stripJsonFence(content)));
      verdicts.push(parsed.verdict);
      totalRuns += 1;

      if (parsed.verdict === testCase.expected) {
        agreementCount += 1;
        caseAgreement += 1;
      }

      console.log(
        `${testCase.ruleId} run ${run}: expected ${testCase.expected}, got ${parsed.verdict}${parsed.verdict === testCase.expected ? "" : " (miss)"}`,
      );
    }

    const flipped = new Set(verdicts).size > 1;
    if (flipped) {
      flippingCases.push(`${testCase.ruleId} — ${testCase.why}`);
    }

    caseReports.push({
      ruleId: testCase.ruleId,
      why: testCase.why,
      expected: testCase.expected,
      verdicts,
      agreementCount: caseAgreement,
      flipped,
    });
  }

  const agreementRate =
    totalRuns === 0 ? 0 : Math.round((agreementCount / totalRuns) * 100);
  const varianceRate =
    cases.length === 0 ? 0 : Math.round((flippingCases.length / cases.length) * 100);

  return {
    agreementRate,
    agreementCount,
    totalRuns,
    varianceRate,
    flippingCases,
    cases: caseReports,
    runsPerCase: RUNS_PER_CASE,
    passed: agreementRate >= JUDGEMENT_AGREEMENT_THRESHOLD,
  };
}

function printJudgementSummary(result: JudgementEvalResult): void {
  console.log("\n--- Judgement summary ---");
  console.log(`Agreement: ${result.agreementCount}/${result.totalRuns} (${result.agreementRate}%)`);
  console.log(
    `Variance rate: ${result.flippingCases.length}/${result.cases.length} cases (${result.varianceRate}%) — run-to-run flip within case`,
  );
  if (result.flippingCases.length > 0) {
    console.log("Flipping cases:");
    for (const caseId of result.flippingCases) {
      console.log(`- ${caseId}`);
    }
  } else {
    console.log("Flipping cases: none");
  }
  if (!result.passed) {
    console.log(`FAIL: agreement below ${JUDGEMENT_AGREEMENT_THRESHOLD}% threshold`);
  }
}

async function main(): Promise<void> {
  console.log(`Judgement golden — ${loadJudgementCases().length} cases × ${RUNS_PER_CASE} runs\n`);
  const judgement = await runJudgementEval();
  printJudgementSummary(judgement);

  const report = buildEvalReport({
    model: resolveEvalModel(),
    judgement,
  });
  writeEvalReport(report);

  if (!judgement.passed) {
    process.exit(1);
  }
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error("judgement golden failed:", message);
    process.exit(1);
  });
}
