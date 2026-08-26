/**
 * golden.test — golden case runner (Phase 2.5 gate).
 * Why: det describe is 100% gate; judgement may skip → not run.
 */
import { describe, expect, it } from "vitest";

import { getDeterministicRuleById } from "../src/catalog.js";
import detCases from "./det.json";
import judgementCases from "./judgement.json";

interface GoldenDetCase {
  snippet: string;
  ruleId: string;
  expected: "pass" | "fail";
  why: string;
}

interface GoldenJudgementCase {
  snippet: string;
  ruleId: string;
  expected: "pass" | "fail";
  why: string;
}

describe("golden det", () => {
  for (const testCase of detCases as GoldenDetCase[]) {
    it(`${testCase.ruleId} — ${testCase.why}`, () => {
      const rule = getDeterministicRuleById(testCase.ruleId);
      expect(rule, `unknown det rule ${testCase.ruleId}`).toBeDefined();

      const result = rule?.match(testCase.snippet);
      expect(result?.machineVerdict).toBe(testCase.expected);
    });
  }
});

describe("golden judgement", () => {
  it("runs via backend script — npm run judgement-golden in preflight-backend", () => {
    const cases = judgementCases as GoldenJudgementCase[];
    expect(cases.length).toBeGreaterThanOrEqual(10);
  });
});
