/**
 * golden-report — write det golden summary markdown (Phase 2.5 report).
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { getDeterministicRuleById } from "../src/catalog.js";
import detCases from "../golden/det.json";

interface GoldenDetCase {
  snippet: string;
  ruleId: string;
  expected: "pass" | "fail";
  why: string;
}

const root = dirname(fileURLToPath(import.meta.url));
const reportPath = join(root, "../golden/golden-report.md");

const rows: string[] = [
  "# Deterministic golden report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "| Rule | Expected | Actual | Result | Why |",
  "|---|---|---|---|---|",
];

let passed = 0;
let failed = 0;

for (const testCase of detCases as GoldenDetCase[]) {
  const rule = getDeterministicRuleById(testCase.ruleId);
  const actual = rule?.match(testCase.snippet).machineVerdict ?? "missing";
  const ok = actual === testCase.expected;
  if (ok) {
    passed += 1;
  } else {
    failed += 1;
  }
  rows.push(
    `| ${testCase.ruleId} | ${testCase.expected} | ${actual} | ${ok ? "pass" : "FAIL"} | ${testCase.why} |`,
  );
}

rows.push("");
rows.push(`**Summary:** ${passed}/${passed + failed} (${failed === 0 ? "100%" : "incomplete"})`);

writeFileSync(reportPath, rows.join("\n"), "utf8");
console.log(`Wrote ${reportPath} — ${passed}/${passed + failed} pass`);

if (failed > 0) {
  process.exit(1);
}
