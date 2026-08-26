/**
 * run-evals — G-08 orchestrator: judgement + generator + extractor.
 */
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config({
  path: path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../.env",
  ),
});

const { buildEvalReport, JUDGEMENT_AGREEMENT_THRESHOLD, resolveEvalModel, writeEvalReport } =
  await import("./eval-shared.js");
const { runExtractorEval } = await import("./run-extractor-eval.js");
const { runGeneratorEval } = await import("./run-generator-eval.js");
const { loadJudgementCases, runJudgementEval } = await import("./run-judgement-golden.js");

async function main(): Promise<void> {
  console.log("Preflight eval harness (G-08)\n");

  console.log(`=== Judgement (${loadJudgementCases().length} cases) ===`);
  const judgement = await runJudgementEval();

  console.log("\n=== Generator (3 cases) ===");
  const generator = await runGeneratorEval();

  console.log("\n=== Extractor (3 cases) ===");
  const extractor = await runExtractorEval();

  const report = buildEvalReport({
    model: resolveEvalModel(),
    judgement,
    generator,
    extractor,
  });
  writeEvalReport(report);

  console.log("\n--- Eval summary ---");
  console.log(
    `Judgement: ${judgement.agreementCount}/${judgement.totalRuns} (${judgement.agreementRate}%) — threshold ${JUDGEMENT_AGREEMENT_THRESHOLD}%`,
  );
  console.log(`Generator: ${generator.passedCount}/${generator.totalCases} structural pass`);
  console.log(`Extractor: ${extractor.passedCount}/${extractor.totalCases} structural pass`);
  console.log(`Report: packages/rules/golden/eval-report.json`);
  console.log(`Overall: ${report.passed ? "PASS" : "FAIL"}`);

  if (!report.passed) {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("eval harness failed:", message);
  process.exit(1);
});
