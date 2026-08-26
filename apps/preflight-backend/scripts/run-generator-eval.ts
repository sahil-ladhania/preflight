/**
 * run-generator-eval — generator structural eval (G-08).
 */
import dotenv from "dotenv";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { GeneratorOutputSchema, type Channel, type StructuredBriefInput } from "@preflight/schemas";

import { buildGeneratorPrompt } from "../agents/generator.prompt.js";
import { FROZEN_WORDING } from "../prisma/seed/judgement-rules.js";
import {
  resolveGeneratorSkillNames,
  skillFilePath,
} from "../src/lib/agent-skills.js";
import { loadBrandKit } from "../src/lib/brand-kit.js";
import {
  AGENT_EVAL_TIMEOUT_MS,
  stripJsonFence,
  type GeneratorCaseReport,
  type GeneratorEvalResult,
} from "./eval-shared.js";

dotenv.config({
  path: path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../.env",
  ),
});

interface GeneratorEvalCase {
  id: string;
  channel: Channel;
  brief: StructuredBriefInput;
}

const EVAL_RULES = [
  { ruleId: "SEBI-01", kind: "det" as const, wording: FROZEN_WORDING["SEBI-01"] },
  { ruleId: "SEBI-06", kind: "judgement" as const, wording: FROZEN_WORDING["SEBI-06"] },
  { ruleId: "BRAND-02", kind: "judgement" as const, wording: FROZEN_WORDING["BRAND-02"] },
];

function loadGeneratorCases(): GeneratorEvalCase[] {
  const casesPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "eval-generator-cases.json",
  );
  return JSON.parse(readFileSync(casesPath, "utf8")) as GeneratorEvalCase[];
}

function checkGeneratorOutput(
  output: ReturnType<typeof GeneratorOutputSchema.parse>,
  brandKit: ReturnType<typeof loadBrandKit>,
): string[] {
  const errors: string[] = [];
  const combined = `${output.headline} ${output.body} ${output.disclaimer} ${output.cta}`.toLowerCase();

  for (const claim of brandKit.forbiddenClaims) {
    if (combined.includes(claim.toLowerCase())) {
      errors.push(`forbidden claim present: "${claim}"`);
    }
  }

  if (!output.disclaimer.toLowerCase().includes(brandKit.requiredDisclaimer.toLowerCase())) {
    errors.push("disclaimer missing required phrase");
  }

  return errors;
}

export async function runGeneratorEval(): Promise<GeneratorEvalResult> {
  const { runAgent } = await import("../src/lib/gitagent.js");
  const brandKit = loadBrandKit();
  const cases = loadGeneratorCases();
  const reports: GeneratorCaseReport[] = [];

  for (const testCase of cases) {
    const skillNames = resolveGeneratorSkillNames(testCase.channel);
    const prompt = buildGeneratorPrompt({
      channel: testCase.channel,
      brief: testCase.brief,
      brandKit,
      rules: EVAL_RULES,
      detHintLines: [],
      inScopeSkillPaths: skillNames.map(skillFilePath),
    });

    const errors: string[] = [];

    try {
      const { content } = await runAgent("generator", prompt, {
        timeoutMs: AGENT_EVAL_TIMEOUT_MS,
        skillNames,
      });
      const parsed: unknown = JSON.parse(stripJsonFence(content));
      const output = GeneratorOutputSchema.parse(parsed);
      errors.push(...checkGeneratorOutput(output, brandKit));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Generator eval failed.";
      errors.push(message);
    }

    const passed = errors.length === 0;
    reports.push({
      id: testCase.id,
      channel: testCase.channel,
      passed,
      errors,
    });

    console.log(
      `generator ${testCase.id} (${testCase.channel}): ${passed ? "pass" : `fail — ${errors.join("; ")}`}`,
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
  runGeneratorEval()
    .then((result) => {
      console.log(`\nGenerator eval: ${result.passedCount}/${result.totalCases} passed`);
      if (!result.passed) {
        process.exit(1);
      }
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error("generator eval failed:", message);
      process.exit(1);
    });
}
