/**
 * eval-shared — types and helpers for G-08 live eval harness.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const JUDGEMENT_AGREEMENT_THRESHOLD = 85;
export const RUNS_PER_CASE = 3;
export const AGENT_EVAL_TIMEOUT_MS = 120_000;

const SCRIPT_DIR = pathDirname();

export function evalReportPath(): string {
  return resolve(SCRIPT_DIR, "../../../packages/rules/golden/eval-report.json");
}

function pathDirname(): string {
  return dirname(fileURLToPath(import.meta.url));
}

export function resolveEvalModel(manifestPreferred = "openai:gpt-4o-mini"): string {
  return process.env.OPENAI_MODEL ?? manifestPreferred;
}

export function stripJsonFence(content: string): string {
  const trimmed = content.trim();
  const match = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  return match?.[1]?.trim() ?? trimmed;
}

export interface JudgementCaseReport {
  ruleId: string;
  why: string;
  expected: "pass" | "fail";
  verdicts: Array<"pass" | "fail">;
  agreementCount: number;
  flipped: boolean;
}

export interface JudgementEvalResult {
  agreementRate: number;
  agreementCount: number;
  totalRuns: number;
  varianceRate: number;
  flippingCases: string[];
  cases: JudgementCaseReport[];
  runsPerCase: number;
  passed: boolean;
}

export interface GeneratorCaseReport {
  id: string;
  channel: string;
  passed: boolean;
  errors: string[];
}

export interface GeneratorEvalResult {
  passedCount: number;
  totalCases: number;
  cases: GeneratorCaseReport[];
  passed: boolean;
}

export interface ExtractorCaseReport {
  id: string;
  passed: boolean;
  errors: string[];
}

export interface ExtractorEvalResult {
  passedCount: number;
  totalCases: number;
  cases: ExtractorCaseReport[];
  passed: boolean;
}

export interface EvalReport {
  at: string;
  model: string;
  agreementThreshold: number;
  judgement: JudgementEvalResult;
  generator: GeneratorEvalResult;
  extractor: ExtractorEvalResult;
  passed: boolean;
}

export function emptyGeneratorEval(): GeneratorEvalResult {
  return { passedCount: 0, totalCases: 0, cases: [], passed: true };
}

export function emptyExtractorEval(): ExtractorEvalResult {
  return { passedCount: 0, totalCases: 0, cases: [], passed: true };
}

export function buildEvalReport(input: {
  model: string;
  judgement: JudgementEvalResult;
  generator?: GeneratorEvalResult;
  extractor?: ExtractorEvalResult;
}): EvalReport {
  const generator = input.generator ?? emptyGeneratorEval();
  const extractor = input.extractor ?? emptyExtractorEval();
  const passed = input.judgement.passed && generator.passed && extractor.passed;

  return {
    at: new Date().toISOString(),
    model: input.model,
    agreementThreshold: JUDGEMENT_AGREEMENT_THRESHOLD,
    judgement: input.judgement,
    generator,
    extractor,
    passed,
  };
}

export function writeEvalReport(report: EvalReport, path = evalReportPath()): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}
