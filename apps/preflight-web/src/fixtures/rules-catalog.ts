/**
 * rules-catalog — Screen 4 GET /rules fixture.
 * Why: merged det ∪ judgement catalog without wiring.
 */

import type { RuleCatalogRowDTO } from "@preflight/schemas";

import { FROZEN_WORDING } from "@/fixtures/assets-detail/shared";

const DET_IDS = ["SEBI-01", "SEBI-02", "SEBI-03", "SEBI-04", "SEBI-05"] as const;

const JUDGEMENT_ROWS: RuleCatalogRowDTO[] = [
  {
    ruleId: "SEBI-06",
    kind: "judgement",
    wording: FROZEN_WORDING["SEBI-06"],
    predicateSpec: {
      field: "claims",
      op: "in",
      value: ["performance", "returns"],
    },
    applicabilitySummary: "claims in performance, returns",
    editable: true,
  },
  {
    ruleId: "BRAND-02",
    kind: "judgement",
    wording: FROZEN_WORDING["BRAND-02"],
    predicateSpec: {
      field: "channels",
      op: "in",
      value: ["linkedin", "email"],
    },
    applicabilitySummary: "channels in linkedin, email",
    editable: true,
  },
  {
    ruleId: "BRAND-03",
    kind: "judgement",
    wording: FROZEN_WORDING["BRAND-03"],
    predicateSpec: {
      field: "claims",
      op: "in",
      value: ["differentiation", "market-leading"],
    },
    applicabilitySummary: "claims in differentiation, market-leading",
    editable: true,
  },
  {
    ruleId: "44444444-4444-4444-8444-444444444402",
    kind: "judgement",
    wording: FROZEN_WORDING["BRAND-05"],
    predicateSpec: {
      field: "channels",
      op: "equals",
      value: "whatsapp",
    },
    applicabilitySummary: "channels equals whatsapp",
    editable: true,
  },
];

function detRows(): RuleCatalogRowDTO[] {
  return DET_IDS.map((ruleId) => ({
    ruleId,
    kind: "deterministic" as const,
    wording: FROZEN_WORDING[ruleId],
    predicateSpec: null,
    applicabilitySummary: null,
    editable: false,
  }));
}

export const RULES_CATALOG: RuleCatalogRowDTO[] = [
  ...detRows(),
  ...JUDGEMENT_ROWS,
];

export const POST_SAVE_CAPTION =
  "Live catalog updated. Existing assets keep their frozen snapshots — recompile on Campaign or re-run on Assets to compare.";
