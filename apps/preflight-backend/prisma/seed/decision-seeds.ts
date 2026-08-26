/**
 * decision-seeds — derive FindingDecision rows from seed findings.
 * Why: G-02 demo history populated on A–H walkthrough.
 */
import { randomUUID } from "node:crypto";

import type { FindingSeed } from "./story-h.js";

export interface DecisionSeed {
  id: string;
  findingId: string;
  action: "waive" | "confirm" | "override" | "retry";
  previousVerdict: "confirmed" | "overridden" | "waived" | null;
  verdict: "confirmed" | "overridden" | "waived" | null;
  reason: string | null;
  actor: string;
  at: Date;
}

function actionForVerdict(
  verdict: NonNullable<FindingSeed["humanVerdict"]>,
): DecisionSeed["action"] {
  if (verdict === "waived") {
    return "waive";
  }

  if (verdict === "confirmed") {
    return "confirm";
  }

  return "override";
}

function decisionSeed(
  findingId: string,
  input: Omit<DecisionSeed, "id" | "findingId">,
): DecisionSeed {
  return {
    id: randomUUID(),
    findingId,
    ...input,
  };
}

export function buildDecisionSeeds(
  assetLetter: string,
  findings: FindingSeed[],
): DecisionSeed[] {
  const rows: DecisionSeed[] = [];

  for (const finding of findings) {
    if (finding.humanVerdict === null || finding.humanActor === null || finding.humanAt === null) {
      continue;
    }

    const findingId = `f-${assetLetter}-${finding.ruleId}`.padEnd(36, "0");

    rows.push(
      decisionSeed(findingId, {
        action: actionForVerdict(finding.humanVerdict),
        previousVerdict: null,
        verdict: finding.humanVerdict,
        reason: finding.humanReason,
        actor: finding.humanActor,
        at: new Date(finding.humanAt),
      }),
    );
  }

  if (assetLetter === "d") {
    const sebi05Id = `f-d-SEBI-05`.padEnd(36, "0");
    const waivedRow = rows.find((row) => row.findingId === sebi05Id);

    if (waivedRow) {
      rows.unshift(
        decisionSeed(sebi05Id, {
          action: "waive",
          previousVerdict: null,
          verdict: "waived",
          reason: "Internal demo — will revisit.",
          actor: waivedRow.actor,
          at: new Date("2026-03-13T15:05:00.000Z"),
        }),
      );
      waivedRow.previousVerdict = "waived";
    }
  }

  return rows;
}
