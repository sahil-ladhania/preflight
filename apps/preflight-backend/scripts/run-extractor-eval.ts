/**
 * run-extractor-eval — extractor structural eval (G-08).
 */
import dotenv from "dotenv";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ExtractorOutputSchema } from "@preflight/schemas";

import { buildExtractorPrompt } from "../agents/extractor.prompt.js";
import {
  AGENT_EVAL_TIMEOUT_MS,
  stripJsonFence,
  type ExtractorCaseReport,
  type ExtractorEvalResult,
} from "./eval-shared.js";

dotenv.config({
  path: path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../.env",
  ),
});

interface ExtractorEvalCase {
  id: string;
  freeText: string;
}

function loadExtractorCases(): ExtractorEvalCase[] {
  const casesPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "eval-extractor-cases.json",
  );
  return JSON.parse(readFileSync(casesPath, "utf8")) as ExtractorEvalCase[];
}

export async function runExtractorEval(): Promise<ExtractorEvalResult> {
  const { runAgent } = await import("../src/lib/gitagent.js");
  const cases = loadExtractorCases();
  const reports: ExtractorCaseReport[] = [];

  for (const testCase of cases) {
    const errors: string[] = [];

    try {
      const prompt = buildExtractorPrompt({ freeText: testCase.freeText });
      const { content } = await runAgent("extractor", prompt, {
        timeoutMs: AGENT_EVAL_TIMEOUT_MS,
      });
      const parsed: unknown = JSON.parse(stripJsonFence(content));

      if (typeof parsed === "object" && parsed !== null && "ruleIds" in parsed) {
        errors.push("output must not include ruleIds key");
      }

      ExtractorOutputSchema.parse(parsed);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Extractor eval failed.";
      errors.push(message);
    }

    const passed = errors.length === 0;
    reports.push({ id: testCase.id, passed, errors });

    console.log(
      `extractor ${testCase.id}: ${passed ? "pass" : `fail — ${errors.join("; ")}`}`,
    );
  }

  const passedCount = reports.filter((row) => row.passed).length;

  return {
    passedCount,
    totalCases: reports.length,
    cases: reports,
    passed: passedCount === reports.length,
  };
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  runExtractorEval()
    .then((result) => {
      console.log(`\nExtractor eval: ${result.passedCount}/${result.totalCases} passed`);
      if (!result.passed) {
        process.exit(1);
      }
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error("extractor eval failed:", message);
      process.exit(1);
    });
}
