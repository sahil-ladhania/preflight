/**
 * verify-seed-findings — compare seeded det rows to runDeterministic output.
 * Why: Fix 1 proof that seed survives live re-run (N2 closure).
 */
import { foldStatus } from "@preflight/schemas";

import { ASSET_A_DEF, buildFindingsA } from "./story-a.js";
import { ASSET_B_DEF, buildFindingsB } from "./story-b.js";
import { ASSET_C_DEF, buildFindingsC } from "./story-c.js";
import { ASSET_D_DEF, buildFindingsD } from "./story-d.js";
import { ASSET_E_DEF, buildFindingsE } from "./story-e.js";
import { ASSET_F_DEF, buildFindingsF, createStoryHelpers } from "./story-f.js";
import { ASSET_G_DEF, buildFindingsG } from "./story-g.js";
import {
  FREEZE_FINDING_COUNT,
  runDetEngine,
} from "./story-findings.js";
import { buildCanonicalText } from "./story-h.js";

const EXPECTED_STATUS: Record<string, string> = {
  A: "needs_regen",
  B: "needs_human",
  C: "blocked",
  D: "cleared_with_exception",
  E: "clear",
  F: "needs_human",
  G: "needs_human",
};

const MODULES = [
  { letter: "A", def: ASSET_A_DEF, build: buildFindingsA },
  { letter: "B", def: ASSET_B_DEF, build: buildFindingsB },
  { letter: "C", def: ASSET_C_DEF, build: buildFindingsC },
  { letter: "D", def: ASSET_D_DEF, build: buildFindingsD },
  { letter: "E", def: ASSET_E_DEF, build: buildFindingsE },
  { letter: "F", def: ASSET_F_DEF, build: buildFindingsF },
  { letter: "G", def: ASSET_G_DEF, build: buildFindingsG },
];

function spanKey(
  spans: Array<{ start: number; end: number; text: string }>,
): string {
  return JSON.stringify(spans);
}

function main(): void {
  const helpers = createStoryHelpers();
  let failed = false;

  for (const module of MODULES) {
    const { canonicalText } = buildCanonicalText(module.def.copy);
    const engine = runDetEngine(canonicalText);
    const seeded = module.build(canonicalText, helpers);
    const detSeeded = seeded.filter((row) => row.kind === "deterministic");

    console.log(`\n=== Asset ${module.letter} ===`);
    console.log(`findings: ${seeded.length} (expected ${FREEZE_FINDING_COUNT})`);

    if (seeded.length !== FREEZE_FINDING_COUNT) {
      failed = true;
      console.log("FAIL count mismatch");
    }

    const fold = foldStatus(
      seeded.map((row) => ({
        kind: row.kind,
        evaluationStatus: row.evaluationStatus,
        machineVerdict: row.machineVerdict,
        humanVerdict: row.humanVerdict,
      })),
    );
    const expected = EXPECTED_STATUS[module.letter];
    console.log(`fold: ${fold} (expected ${expected})`);
    if (fold !== expected) {
      failed = true;
      console.log("FAIL fold mismatch");
    }

    console.log("ruleId | engine | seeded | spans match");
    for (const engineRow of engine) {
      const seedRow = detSeeded.find((row) => row.ruleId === engineRow.ruleId);
      if (!seedRow) {
        failed = true;
        console.log(`${engineRow.ruleId} | ${engineRow.machineVerdict} | MISSING | —`);
        continue;
      }

      const spansMatch =
        spanKey(engineRow.spans) === spanKey(seedRow.spans);
      const verdictMatch = engineRow.machineVerdict === seedRow.machineVerdict;
      const ok = spansMatch && verdictMatch;
      if (!ok) {
        failed = true;
      }

      console.log(
        `${engineRow.ruleId} | ${engineRow.machineVerdict} | ${seedRow.machineVerdict} | ${spansMatch ? "yes" : "NO"}`,
      );
      if (!spansMatch) {
        console.log(`  engine spans: ${spanKey(engineRow.spans)}`);
        console.log(`  seeded spans: ${spanKey(seedRow.spans)}`);
      }
    }
  }

  if (failed) {
    process.exit(1);
  }

  console.log("\nAll seed det rows match engine output; folds OK.");
}

main();
