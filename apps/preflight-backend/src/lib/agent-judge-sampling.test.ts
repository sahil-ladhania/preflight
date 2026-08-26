/**
 * agent-judge-sampling.test — deriveJudgeSeed and buildJudgeConstraints (G-06).
 */
import assert from "node:assert/strict";
import test from "node:test";

import {
  buildJudgeConstraints,
  deriveJudgeSeed,
  JUDGE_DEFAULT_CONSTRAINTS,
  resolveJudgeQueryConstraints,
} from "./agent-judge-sampling.js";

test("deriveJudgeSeed is stable for same inputs", () => {
  const a = deriveJudgeSeed("Past performance is not indicative.", "SEBI-06");
  const b = deriveJudgeSeed("Past performance is not indicative.", "SEBI-06");
  assert.equal(a, b);
});

test("deriveJudgeSeed differs for different inputs", () => {
  const a = deriveJudgeSeed("Past performance is not indicative.", "SEBI-06");
  const b = deriveJudgeSeed("Past performance is not indicative.", "BRAND-03");
  assert.notEqual(a, b);
});

test("buildJudgeConstraints returns temperature 0 and topP 1", () => {
  const result = buildJudgeConstraints("copy text", "SEBI-06");
  assert.deepEqual(result.constraints, JUDGE_DEFAULT_CONSTRAINTS);
  assert.equal(typeof result.seed, "number");
  assert.ok(Number.isFinite(result.seed));
});

test("resolveJudgeQueryConstraints defaults without judgeDeterminism", () => {
  const result = resolveJudgeQueryConstraints();
  assert.deepEqual(result.constraints, JUDGE_DEFAULT_CONSTRAINTS);
  assert.equal(result.seed, null);
  assert.equal(result.ruleId, null);
});

test("resolveJudgeQueryConstraints derives seed when inputs provided", () => {
  const result = resolveJudgeQueryConstraints({
    canonicalText: "copy",
    ruleId: "SEBI-06",
  });
  assert.deepEqual(result.constraints, JUDGE_DEFAULT_CONSTRAINTS);
  assert.equal(result.seed, deriveJudgeSeed("copy", "SEBI-06"));
  assert.equal(result.ruleId, "SEBI-06");
});
