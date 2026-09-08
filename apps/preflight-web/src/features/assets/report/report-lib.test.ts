/**
 * report-lib.test — compliance exhibit derived copy.
 */

import { describe, expect, it } from "vitest";

import type { FindingDTO } from "@preflight/schemas";

import {
  isMaterialReportFinding,
  partitionFindingsForReport,
  reportCheckSummary,
  reportGeneratorProvenance,
  reportIdentityCampaignLine,
  reportStatusClosingSentence,
  sortFindingsForReport,
  sortSnapshotsForReport,
} from "@/features/assets/report/report-lib";
import { complianceReportFilename } from "@/features/assets/lib";

function finding(
  ruleId: string,
  overrides: Partial<FindingDTO> = {},
): FindingDTO {
  return {
    id: `finding-${ruleId}`,
    ruleId,
    kind: "deterministic",
    frozenWording: "Rule wording.",
    evaluationStatus: "complete",
    machineVerdict: "fail",
    machineReason: "Failed.",
    spans: [],
    machineAt: "2026-01-01T00:00:00.000Z",
    humanVerdict: null,
    humanReason: null,
    humanActor: null,
    humanAt: null,
    judgeRun: null,
    decisions: [],
    ...overrides,
  };
}

describe("reportStatusClosingSentence", () => {
  it("names unwaived deterministic blockers", () => {
    const findings = [
      finding("SEBI-03", { kind: "deterministic", humanVerdict: null }),
      finding("SEBI-04", {
        kind: "deterministic",
        humanVerdict: "waived",
      }),
    ];

    expect(reportStatusClosingSentence("blocked", findings)).toBe(
      "Blocked because unwaived SEBI-03.",
    );
  });

  it("describes clear status", () => {
    expect(reportStatusClosingSentence("clear", [])).toBe(
      "Clear — every check resolved without exception.",
    );
  });

  it("lists waived rules for exception status", () => {
    const findings = [
      finding("SEBI-06", { humanVerdict: "waived", humanReason: "Ship anyway." }),
    ];

    expect(reportStatusClosingSentence("cleared_with_exception", findings)).toBe(
      "Cleared with exception — waived SEBI-06.",
    );
  });
});

describe("reportGeneratorProvenance", () => {
  it("returns seeded copy when generator run is absent", () => {
    expect(
      reportGeneratorProvenance({
        generatorRun: null,
      } as Parameters<typeof reportGeneratorProvenance>[0]),
    ).toBe("Seeded — no live generator run");
  });
});

describe("sort helpers", () => {
  it("sorts findings and snapshots by rule id", () => {
    const sortedFindings = sortFindingsForReport([
      finding("SEBI-02"),
      finding("SEBI-01"),
    ]);
    expect(sortedFindings.map((row) => row.ruleId)).toEqual([
      "SEBI-01",
      "SEBI-02",
    ]);

    const sortedSnapshots = sortSnapshotsForReport([
      { ruleId: "B", kind: "judgement", wording: "b" },
      { ruleId: "A", kind: "deterministic", wording: "a" },
    ]);
    expect(sortedSnapshots.map((row) => row.ruleId)).toEqual(["A", "B"]);
  });
});

describe("complianceReportFilename", () => {
  it("uses the first eight characters of the asset id", () => {
    expect(
      complianceReportFilename("23a1dd39-729c-4516-8863-6a7acd3bfe80"),
    ).toBe("preflight-asset-23a1dd39-report.json");
  });
});

describe("reportIdentityCampaignLine", () => {
  it("shows a truncated campaign id", () => {
    expect(
      reportIdentityCampaignLine({
        campaignId: "8e801f0b-a986-4d76-9609-e7e356a2b1c5",
      } as Parameters<typeof reportIdentityCampaignLine>[0]),
    ).toBe("Campaign 8e801f0b");
  });
});

describe("isMaterialReportFinding", () => {
  it("returns false for a clean machine pass", () => {
    expect(
      isMaterialReportFinding(
        finding("SEBI-02", { machineVerdict: "pass", machineReason: null }),
      ),
    ).toBe(false);
  });

  it("returns true for machine fail", () => {
    expect(isMaterialReportFinding(finding("SEBI-03"))).toBe(true);
  });

  it("returns true when human decided", () => {
    expect(
      isMaterialReportFinding(finding("SEBI-05", { humanVerdict: "waived" })),
    ).toBe(true);
  });

  it("returns true for pending and unavailable", () => {
    expect(
      isMaterialReportFinding(
        finding("SEBI-01", {
          evaluationStatus: "pending",
          machineVerdict: "pass",
        }),
      ),
    ).toBe(true);
    expect(
      isMaterialReportFinding(
        finding("SEBI-04", {
          evaluationStatus: "unavailable",
          machineVerdict: "pass",
        }),
      ),
    ).toBe(true);
  });
});

describe("partitionFindingsForReport", () => {
  it("splits and sorts material vs pass findings", () => {
    const { material, passes } = partitionFindingsForReport([
      finding("SEBI-03"),
      finding("SEBI-02", { machineVerdict: "pass", machineReason: null }),
      finding("SEBI-01", { machineVerdict: "pass", machineReason: null }),
      finding("SEBI-05", { humanVerdict: "waived" }),
    ]);

    expect(material.map((row) => row.ruleId)).toEqual(["SEBI-03", "SEBI-05"]);
    expect(passes.map((row) => row.ruleId)).toEqual(["SEBI-01", "SEBI-02"]);
  });
});

describe("reportCheckSummary", () => {
  it("counts passed, failed, waived, and open findings", () => {
    const summary = reportCheckSummary([
      finding("SEBI-03"),
      finding("SEBI-04", { machineVerdict: "pass", machineReason: null }),
      finding("SEBI-05", { humanVerdict: "waived" }),
      finding("SEBI-06", {
        evaluationStatus: "pending",
        machineVerdict: "pass",
      }),
    ]);

    expect(summary).toEqual({
      total: 4,
      passed: 1,
      failed: 2,
      waived: 1,
      open: 2,
    });
  });
});
