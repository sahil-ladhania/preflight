/**
 * judgement-rules — JudgementRule seed rows.
 * Why: live catalog wording duplicated from fixtures; not imported from web.
 */
import { randomUUID } from "node:crypto";

import type { PrismaClient } from "@prisma/client";
import type { PredicateSpec } from "@preflight/rules";

import { buildRulebookChangeRowData } from "../../src/features/rulebook-changes/rulebook-changes.service.js";

export const JUDGEMENT_RULE_IDS = {
  SEBI_06: "66666666-6666-4666-8666-666666660006",
  BRAND_02: "66666666-6666-4666-8666-666666660002",
  BRAND_03: "66666666-6666-4666-8666-666666660003",
  DRIFT_DEMO: "44444444-4444-4444-8444-444444444402",
} as const;

export const FROZEN_WORDING = {
  "SEBI-01": "Standard risk disclaimer must appear in the asset copy.",
  "SEBI-02": "Scheme name must appear on first mention.",
  "SEBI-03": "CAGR claims must name the period.",
  "SEBI-04": "Banned promotional phrases are not permitted.",
  "SEBI-05": "Performance figures require substantiation.",
  "SEBI-06": "Performance claims must not imply guaranteed returns.",
  "BRAND-02": "Brand voice must stay professional.",
  "BRAND-03": "Claims must not overstate fund differentiation.",
  "BRAND-05": "Tone must match approved channel norms.",
} as const;

const JUDGEMENT_ROWS: Array<{
  id: string;
  wording: string;
  predicateSpec: PredicateSpec;
}> = [
  {
    id: JUDGEMENT_RULE_IDS.SEBI_06,
    wording: FROZEN_WORDING["SEBI-06"],
    predicateSpec: {
      field: "claims",
      op: "in",
      value: ["performance", "returns"],
    },
  },
  {
    id: JUDGEMENT_RULE_IDS.BRAND_02,
    wording: FROZEN_WORDING["BRAND-02"],
    predicateSpec: {
      field: "channels",
      op: "in",
      value: ["linkedin", "email"],
    },
  },
  {
    id: JUDGEMENT_RULE_IDS.BRAND_03,
    wording: FROZEN_WORDING["BRAND-03"],
    predicateSpec: {
      field: "claims",
      op: "in",
      value: ["differentiation", "market-leading"],
    },
  },
  {
    id: JUDGEMENT_RULE_IDS.DRIFT_DEMO,
    wording: FROZEN_WORDING["BRAND-05"],
    predicateSpec: {
      field: "channels",
      op: "equals",
      value: "whatsapp",
    },
  },
];

const SEED_ACTOR = process.env.DEMO_OPERATOR_NAME ?? "Demo Operator";
const SEED_REASON = "Seeded live catalog.";

export async function seedJudgementRules(prisma: PrismaClient): Promise<void> {
  const now = new Date("2026-03-13T08:00:00.000Z");

  for (const row of JUDGEMENT_ROWS) {
    await prisma.judgementRule.create({
      data: {
        id: row.id,
        wording: row.wording,
        predicateSpec: row.predicateSpec,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  await prisma.rulebookChange.createMany({
    data: JUDGEMENT_ROWS.map((row) =>
      buildRulebookChangeRowData(
        {
          ruleId: row.id,
          action: "create",
          prevWording: null,
          nextWording: row.wording,
          prevPredicateSpec: null,
          nextPredicateSpec: row.predicateSpec,
          actor: SEED_ACTOR,
          reason: SEED_REASON,
          at: now,
        },
        randomUUID(),
      ),
    ),
  });
}
