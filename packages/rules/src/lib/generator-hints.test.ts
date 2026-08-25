import { describe, expect, it } from "vitest";

import { buildGeneratorHintLines } from "./generator-hints.js";

describe("buildGeneratorHintLines", () => {
  it("returns empty when no det rules pinned", () => {
    expect(
      buildGeneratorHintLines([], {
        schemeName: "Summit Balanced Advantage Fund",
        performanceFigures: [],
      }),
    ).toEqual([]);
  });

  it("includes SEBI-01 exact disclaimer phrase", () => {
    const lines = buildGeneratorHintLines(["SEBI-01"], {
      schemeName: "",
      performanceFigures: [],
    });
    expect(lines[0]).toContain("mutual fund investments are subject to market risks");
  });

  it("includes brief performance template when SEBI-05 pinned", () => {
    const lines = buildGeneratorHintLines(["SEBI-05"], {
      schemeName: "Summit Balanced Advantage Fund",
      performanceFigures: [{ value: "11.2%", period: "3 years" }],
    });
    expect(lines.some((line) => line.includes("11.2%"))).toBe(true);
    expect(lines.some((line) => line.includes("not indicative"))).toBe(true);
  });
});
