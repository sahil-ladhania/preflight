/**
 * ledger-lib.test — open-finding predicate and ledger chrome copy.
 */

import { describe, expect, it } from "vitest";

import type { FindingDTO } from "@preflight/schemas";

import {
  adjacentOpenId,
  firstOpenFindingId,
  initialLedgerFilter,
  isOpenFinding,
  ledgerCountLine,
  lineageVersionLabel,
  openFindings,
  rowLeftHue,
  stepperLabel,
  visibleFindings,
  wordingTone,
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
  it("returns empty string at zero", () => {
    expect(stepperLabel([], 0)).toBe("");
  });

  it("numbers the current open finding", () => {
    expect(stepperLabel([finding({ id: "a" })], 0)).toBe("Finding 1 of 1");
  });
});

describe("rowLeftHue", () => {
  it("returns decision border when human verdict exists", () => {
    expect(rowLeftHue(finding({ humanVerdict: "waived" }))).toBe(
      "border-l-[3px] border-decision",
    );
  });

  it("returns attention border for pending or unavailable", () => {
    expect(
      rowLeftHue(finding({ evaluationStatus: "pending", machineVerdict: null })),
    ).toBe("border-l-[3px] border-attention");
    expect(
      rowLeftHue(
        finding({ evaluationStatus: "unavailable", machineVerdict: null }),
      ),
    ).toBe("border-l-[3px] border-attention");
  });

  it("returns fail border for machine fail", () => {
    expect(rowLeftHue(finding({ machineVerdict: "fail" }))).toBe(
      "border-l-[3px] border-fail",
    );
  });

  it("returns transparent border for pass", () => {
    expect(rowLeftHue(finding({ machineVerdict: "pass" }))).toBe(
      "border-l-[3px] border-transparent",
    );
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

describe("firstOpenFindingId", () => {
  it("returns the first open finding id", () => {
    const findings = [
      finding({ id: "a", machineVerdict: "pass" }),
      finding({ id: "b", machineVerdict: "fail" }),
    ];
    expect(firstOpenFindingId(findings)).toBe("b");
  });

  it("returns null when nothing is open", () => {
    const findings = [finding({ id: "a", machineVerdict: "pass" })];
    expect(firstOpenFindingId(findings)).toBeNull();
  });
});

describe("initialLedgerFilter", () => {
  it("defaults to all even when open findings exist (A3)", () => {
    const findings = [
      finding({ id: "a", machineVerdict: "pass" }),
      finding({ id: "b", machineVerdict: "fail" }),
    ];
    expect(initialLedgerFilter(findings)).toBe("all");
  });

  it("defaults to all when nothing is open", () => {
    const findings = [finding({ id: "a", machineVerdict: "pass" })];
    expect(initialLedgerFilter(findings)).toBe("all");
  });
});

describe("wordingTone", () => {
  it("mutes pass wording", () => {
    expect(wordingTone(finding({ machineVerdict: "pass" }))).toBe("muted");
  });

  it("keeps fail, unavailable, and pending at full ink", () => {
    expect(wordingTone(finding({ machineVerdict: "fail" }))).toBe("ink");
    expect(
      wordingTone(
        finding({
          evaluationStatus: "unavailable",
          machineVerdict: null,
        }),
      ),
    ).toBe("ink");
    expect(
      wordingTone(
        finding({
          evaluationStatus: "pending",
          machineVerdict: null,
        }),
      ),
    ).toBe("ink");
  });

  it("keeps decided fail wording at ink", () => {
    expect(
      wordingTone(
        finding({
          machineVerdict: "fail",
          humanVerdict: "waived",
        }),
      ),
    ).toBe("ink");
  });
});

describe("lineageVersionLabel", () => {
  it("formats generation index as v{n}", () => {
    expect(lineageVersionLabel(2)).toBe("v2");
  });

  it("returns null when generation index is absent", () => {
    expect(lineageVersionLabel(null)).toBeNull();
    expect(lineageVersionLabel(undefined)).toBeNull();
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
