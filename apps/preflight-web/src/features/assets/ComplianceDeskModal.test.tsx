/**
 * ComplianceDeskModal.test — desk naming and exceptions line copy.
 * Why: doc 19 §14 G6 modal polish; logic lives in lib for node vitest.
 */
import { describe, expect, it } from "vitest";

import {
  acceptDisabledCaption,
  acceptIsEnabled,
  buildComplianceDeskExceptionsLine,
  complianceDeskName,
  formatComplianceDeskHandoffToast,
} from "@/features/assets/lib";

const SAMPLE_EXCEPTION = {
  findingId: "finding-d-sebi-05",
  ruleId: "SEBI-05",
  frozenWording: "Performance claims must be substantiated.",
  humanReason: "Approved exception for internal demo static.",
  humanActor: "Demo Operator",
  humanAt: "2026-03-13T15:20:00.000Z",
} as const;

describe("complianceDeskName", () => {
  it("appends Compliance to client name", () => {
    expect(complianceDeskName("Bluepeak Asset Management")).toBe(
      "Bluepeak Asset Management Compliance",
    );
  });
});

describe("buildComplianceDeskExceptionsLine", () => {
  it("shows single exception with rule id for cleared_with_exception", () => {
    expect(
      buildComplianceDeskExceptionsLine("cleared_with_exception", [
        SAMPLE_EXCEPTION,
      ]),
    ).toBe(
      "This asset ships with 1 waived exception (SEBI-05). Exceptions remain visible on this page.",
    );
  });

  it("shows count only when multiple exceptions", () => {
    expect(
      buildComplianceDeskExceptionsLine("cleared_with_exception", [
        SAMPLE_EXCEPTION,
        { ...SAMPLE_EXCEPTION, findingId: "finding-d-sebi-06", ruleId: "SEBI-06" },
      ]),
    ).toBe(
      "This asset ships with 2 waived exceptions. Exceptions remain visible on this page.",
    );
  });

  it("returns null for clear status", () => {
    expect(buildComplianceDeskExceptionsLine("clear", [SAMPLE_EXCEPTION])).toBeNull();
  });

  it("returns null when exceptions list is empty", () => {
    expect(buildComplianceDeskExceptionsLine("cleared_with_exception", [])).toBeNull();
  });
});

describe("formatComplianceDeskHandoffToast", () => {
  it("names the compliance desk in toast copy", () => {
    expect(formatComplianceDeskHandoffToast("Bluepeak Asset Management")).toBe(
      "Handed off to Bluepeak Asset Management Compliance — publishing is outside Preflight.",
    );
  });
});

describe("accept gating", () => {
  it("enables accept for clear and cleared_with_exception", () => {
    expect(acceptIsEnabled("clear")).toBe(true);
    expect(acceptIsEnabled("cleared_with_exception")).toBe(true);
    expect(acceptIsEnabled("blocked")).toBe(false);
    expect(acceptIsEnabled("needs_human")).toBe(false);
    expect(acceptIsEnabled("needs_regen")).toBe(false);
  });

  it("returns disabled captions for non-shippable statuses", () => {
    expect(acceptDisabledCaption("blocked", 4)).toBe(
      "Deterministic blocker still open.",
    );
    expect(acceptDisabledCaption("needs_human", 4)).toBe("Review not finished.");
    expect(acceptDisabledCaption("needs_regen", 4)).toBe(
      "Regenerate this asset to ship.",
    );
    expect(acceptDisabledCaption("clear", 4)).toBeNull();
  });
});
