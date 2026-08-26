/**
 * agent-judge-sampling — judge LLM determinism constraints (G-06).
 * Why: stable sampling params + derived seed for when GitAgent supports it.
 */
import { createHash } from "node:crypto";

export interface JudgeQueryConstraints {
  temperature: number;
  topP: number;
}

export interface JudgeSamplingResult {
  constraints: JudgeQueryConstraints;
  seed: number;
}

function hashJudgeDeterminismInput(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export function deriveJudgeSeed(canonicalText: string, ruleId: string): number {
  const digest = hashJudgeDeterminismInput(`${canonicalText}${ruleId}`);
  return parseInt(digest.slice(0, 8), 16);
}

export function buildJudgeConstraints(
  canonicalText: string,
  ruleId: string,
): JudgeSamplingResult {
  return {
    constraints: {
      temperature: 0,
      topP: 1,
    },
    seed: deriveJudgeSeed(canonicalText, ruleId),
  };
}

export const JUDGE_DEFAULT_CONSTRAINTS: JudgeQueryConstraints = {
  temperature: 0,
  topP: 1,
};

export interface ResolvedJudgeQueryConstraints {
  constraints: JudgeQueryConstraints;
  seed: number | null;
  ruleId: string | null;
}

export function resolveJudgeQueryConstraints(
  judgeDeterminism?: { canonicalText: string; ruleId: string },
): ResolvedJudgeQueryConstraints {
  if (!judgeDeterminism) {
    return { constraints: JUDGE_DEFAULT_CONSTRAINTS, seed: null, ruleId: null };
  }

  const { constraints, seed } = buildJudgeConstraints(
    judgeDeterminism.canonicalText,
    judgeDeterminism.ruleId,
  );

  return { constraints, seed, ruleId: judgeDeterminism.ruleId };
}

export function logJudgeDeterminismDev(
  resolved: ResolvedJudgeQueryConstraints,
  enabled: boolean,
): void {
  if (!enabled || resolved.seed === null || resolved.ruleId === null) {
    return;
  }

  console.info(`judge determinism seed=${resolved.seed} ruleId=${resolved.ruleId}`);
}
