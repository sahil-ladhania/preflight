/**
 * ledger-lib.test — open-finding predicate and ledger chrome copy.
 */

import { describe, expect, it } from "vitest";

import type { FindingDTO } from "@preflight/schemas";

import {
  adjacentOpenId,
  isOpenFinding,
  ledgerCountLine,
  openFindings,
  stepperLabel,
  visibleFindings,
} from "@/features/assets/ledger-lib";

function finding(overrides: Partial<FindingDTO>): FindingDTO {
  return {
    id: "f-1",
    ruleId: "SEBI-01",
    kind: "deterministic",
    frozenWording: "Rule wording",
    evaluationStatus: "complete",
    machineVerdict: "fail",
    machineReason: "Missing disclaimer",
    spans: [],
    machineAt: "2026-03-15T11:05:00.000Z",
    humanVerdict: null,
    humanReason: null,
    humanActor: null,
    humanAt: null,
    judgeRun: null,
    decisions: [],
    ...overrides,
  };
}

describe("isOpenFinding", () => {
  it("treats undecided fail as open", () => {
    expect(isOpenFinding(finding({ machineVerdict: "fail" }))).toBe(true);
  });

  it("treats pending as open", () => {
    expect(
      isOpenFinding(
        finding({
          evaluationStatus: "pending",
          machineVerdict: null,
        }),
      ),
    ).toBe(true);
  });

  it("treats unavailable without human verdict as open", () => {
    expect(
      isOpenFinding(
        finding({
          evaluationStatus: "unavailable",
          machineVerdict: null,
        }),
      ),
    ).toBe(true);
  });

  it("treats pass as not open", () => {
    expect(
      isOpenFinding(
        finding({
          machineVerdict: "pass",
        }),
      ),
    ).toBe(false);
  });

  it("treats decided fail as not open", () => {
    expect(
      isOpenFinding(
        finding({
          humanVerdict: "waived",
        }),
      ),
    ).toBe(false);
  });
});

describe("ledgerCountLine", () => {
  it("formats passed and needs-you counts", () => {
    const findings = [
      finding({ id: "a", machineVerdict: "pass" }),
      finding({ id: "b", machineVerdict: "fail" }),
    ];
    expect(ledgerCountLine(findings)).toBe("1 passed · 1 need you");
  });

  it("reads all resolved when nothing needs you", () => {
    const findings = [
      finding({ id: "a", machineVerdict: "pass" }),
      finding({ id: "b", machineVerdict: "pass" }),
    ];
    expect(ledgerCountLine(findings)).toBe("All 2 rules resolved");
  });

  it("appends pending evaluation copy", () => {
    const findings = [
      finding({
        id: "a",
        evaluationStatus: "pending",
        machineVerdict: null,
      }),
    ];
    expect(ledgerCountLine(findings)).toBe(
      "0 passed · 1 need you Evaluating 1 rules…",
    );
  });
});

describe("stepperLabel", () => {
  it("reads all resolved at zero", () => {
    expect(stepperLabel([], 0)).toBe("All rules resolved");
  });

  it("numbers the current open finding", () => {
    expect(stepperLabel([finding({ id: "a" })], 0)).toBe("Finding 1 of 1");
  });
});

describe("adjacentOpenId", () => {
  const findings = [
    finding({ id: "a" }),
    finding({ id: "b", ruleId: "SEBI-02" }),
    finding({ id: "c", ruleId: "SEBI-03", machineVerdict: "pass" }),
  ];

  it("walks open findings only", () => {
    expect(adjacentOpenId(findings, "a", "next")).toBe("b");
    expect(adjacentOpenId(findings, "b", "prev")).toBe("a");
  });

  it("returns null at range ends", () => {
    expect(adjacentOpenId(findings, "a", "prev")).toBeNull();
    expect(adjacentOpenId(findings, "b", "next")).toBeNull();
  });
});

describe("visibleFindings", () => {
  const findings = [
    finding({ id: "a", machineVerdict: "pass" }),
    finding({ id: "b", machineVerdict: "fail" }),
  ];

  it("shows all findings by default", () => {
    expect(visibleFindings(findings, "all")).toHaveLength(2);
  });

  it("filters to open findings only", () => {
    expect(visibleFindings(findings, "open")).toEqual([findings[1]]);
  });

  it("openFindings matches filter open set", () => {
    expect(openFindings(findings)).toEqual(visibleFindings(findings, "open"));
  });
});
