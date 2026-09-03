/**
 * decision-history-lib.test — decision history modal helpers.
 */

import { describe, expect, it } from "vitest";

import {
  decisionHistoryFooterLine,
  decisionsNewestFirst,
  decisionTransitionLabel,
  decisionVerdictLabel,
  showDecisionHistoryLink,
} from "@/features/assets/decision-history-lib";

const DEMO_OPERATOR = "Demo Operator";

function row(
  overrides: Partial<{
    id: string;
    action: "waive" | "confirm" | "override" | "retry";
    previousVerdict: "confirmed" | "overridden" | "waived" | null;
    verdict: "confirmed" | "overridden" | "waived" | null;
    reason: string | null;
    at: string;
  }> = {},
) {
  return {
    id: overrides.id ?? "dec-1",
    action: overrides.action ?? "waive",
    previousVerdict: overrides.previousVerdict ?? null,
    verdict: overrides.verdict ?? "waived",
    reason: overrides.reason ?? null,
    actor: DEMO_OPERATOR,
    at: overrides.at ?? "2026-03-13T15:20:00.000Z",
  };
}

describe("showDecisionHistoryLink", () => {
  it("hides for zero or one decision", () => {
    expect(showDecisionHistoryLink([])).toBe(false);
    expect(showDecisionHistoryLink([row()])).toBe(false);
  });

  it("shows for two or more decisions", () => {
    expect(showDecisionHistoryLink([row(), row({ id: "dec-2" })])).toBe(true);
  });
});

describe("decisionsNewestFirst", () => {
  it("orders by at descending", () => {
    const older = row({ id: "older", at: "2026-03-13T15:05:00.000Z" });
    const newer = row({ id: "newer", at: "2026-03-13T15:20:00.000Z" });
    expect(decisionsNewestFirst([older, newer])).toEqual([newer, older]);
  });
});

describe("decisionVerdictLabel", () => {
  it("uses human verdict label when present", () => {
    expect(decisionVerdictLabel(row({ verdict: "waived" }))).toBe("Waived");
  });

  it("falls back to action label when verdict is null", () => {
    expect(
      decisionVerdictLabel({
        ...row(),
        action: "retry",
        verdict: null,
      }),
    ).toBe("Retry requested");
  });
});

describe("decisionTransitionLabel", () => {
  it("shows transition when verdict changed", () => {
    expect(
      decisionTransitionLabel(
        row({
          previousVerdict: "confirmed",
          verdict: "overridden",
        }),
      ),
    ).toBe("Confirmed → Overridden");
  });

  it("returns null when verdict unchanged", () => {
    expect(
      decisionTransitionLabel(
        row({
          previousVerdict: "waived",
          verdict: "waived",
        }),
      ),
    ).toBeNull();
  });

  it("returns null when previous verdict is absent", () => {
    expect(
      decisionTransitionLabel(row({ previousVerdict: null, verdict: "waived" })),
    ).toBeNull();
  });
});

describe("decisionHistoryFooterLine", () => {
  it("summarizes count, first date, and in-force verdict", () => {
    const decisions = [
      row({
        id: "dec-1",
        at: "2026-03-13T15:05:00.000Z",
        verdict: "waived",
      }),
      row({
        id: "dec-2",
        at: "2026-03-13T15:20:00.000Z",
        verdict: "waived",
      }),
    ];
    const line = decisionHistoryFooterLine(decisions);
    expect(line).toContain("2 decisions");
    expect(line).toContain("in force: Waived");
    expect(line).toMatch(/first .+2026/);
  });
});
