/**
 * fold-status.test — mandatory precedence fixtures (documentation/12 Area 6).
 */

import { describe, expect, it } from "vitest"
import { foldStatus, type FoldFinding } from "./fold-status.js"

function det(
  machineVerdict: "pass" | "fail",
  humanVerdict: FoldFinding["humanVerdict"] = null,
): FoldFinding {
  return {
    kind: "deterministic",
    evaluationStatus: "complete",
    machineVerdict,
    humanVerdict,
  }
}

function jdg(
  evaluationStatus: FoldFinding["evaluationStatus"],
  machineVerdict: FoldFinding["machineVerdict"],
  humanVerdict: FoldFinding["humanVerdict"] = null,
): FoldFinding {
  return {
    kind: "judgement",
    evaluationStatus,
    machineVerdict,
    humanVerdict,
  }
}

describe("foldStatus", () => {
  it("all pass → clear", () => {
    expect(foldStatus([det("pass"), jdg("complete", "pass")])).toBe("clear")
  })

  it("open det fail → blocked", () => {
    expect(foldStatus([det("fail")])).toBe("blocked")
  })

  it("det fail waived only → cleared_with_exception", () => {
    expect(foldStatus([det("fail", "waived")])).toBe("cleared_with_exception")
  })

  it("jdg pending → needs_human", () => {
    expect(foldStatus([jdg("pending", null)])).toBe("needs_human")
  })

  it("jdg unavailable → needs_human", () => {
    expect(foldStatus([jdg("unavailable", null)])).toBe("needs_human")
  })

  it("open jdg fail → needs_human", () => {
    expect(foldStatus([jdg("complete", "fail")])).toBe("needs_human")
  })

  it("confirmed jdg fail → needs_regen", () => {
    expect(foldStatus([jdg("complete", "fail", "confirmed")])).toBe("needs_regen")
  })

  it("overridden jdg fail → clear", () => {
    expect(foldStatus([jdg("complete", "fail", "overridden")])).toBe("clear")
  })

  it("det fail + jdg pending → blocked", () => {
    expect(foldStatus([det("fail"), jdg("pending", null)])).toBe("blocked")
  })

  it("det fail + confirmed jdg → blocked", () => {
    expect(foldStatus([det("fail"), jdg("complete", "fail", "confirmed")])).toBe("blocked")
  })

  it("waived det + open jdg fail → needs_human", () => {
    expect(foldStatus([det("fail", "waived"), jdg("complete", "fail")])).toBe("needs_human")
  })

  it("two waivers → cleared_with_exception", () => {
    expect(foldStatus([det("fail", "waived"), jdg("complete", "fail", "waived")])).toBe(
      "cleared_with_exception",
    )
  })

  it("empty array → clear", () => {
    expect(foldStatus([])).toBe("clear")
  })
})
