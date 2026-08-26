/**
 * campaign.test — agent response skillsRead is server-attached.
 * Why: model JSON stays its own shape; HTTP DTO wraps it with read paths.
 */
import { describe, expect, it } from "vitest";

import {
  ExtractResponseDTOSchema,
  GenerateResponseDTOSchema,
} from "./campaign.js";

describe("GenerateResponseDTOSchema", () => {
  it("accepts empty skillsRead", () => {
    const parsed = GenerateResponseDTOSchema.parse({
      assets: [{ id: "asset-1", channel: "email" }],
      skillsRead: [],
    });
    expect(parsed.skillsRead).toEqual([]);
  });

  it("accepts generator skill paths", () => {
    const parsed = GenerateResponseDTOSchema.parse({
      assets: [{ id: "asset-1", channel: "email" }],
      skillsRead: ["skills/brand-voice/SKILL.md"],
    });
    expect(parsed.skillsRead).toEqual(["skills/brand-voice/SKILL.md"]);
  });

  it("rejects missing skillsRead", () => {
    expect(() =>
      GenerateResponseDTOSchema.parse({
        assets: [{ id: "asset-1", channel: "email" }],
      }),
    ).toThrow();
  });
});

describe("ExtractResponseDTOSchema", () => {
  const injection = { signals: [] as string[], severity: "low" as const };

  it("wraps the proposal without flattening it", () => {
    const parsed = ExtractResponseDTOSchema.parse({
      proposal: { objective: "Launch awareness" },
      skillsRead: ["skills/brief-structure/SKILL.md"],
      injection,
    });
    expect(parsed.proposal).toEqual({ objective: "Launch awareness" });
    expect(parsed.skillsRead).toEqual(["skills/brief-structure/SKILL.md"]);
    expect(parsed.injection).toEqual(injection);
  });

  it("accepts empty skillsRead", () => {
    const parsed = ExtractResponseDTOSchema.parse({
      proposal: { schemeName: "Bluepeak Flexi Cap Fund" },
      skillsRead: [],
      injection,
    });
    expect(parsed.skillsRead).toEqual([]);
  });

  it("accepts high-severity injection", () => {
    const parsed = ExtractResponseDTOSchema.parse({
      proposal: { objective: "Test" },
      skillsRead: [],
      injection: {
        signals: ["ignore_instructions", "drop_disclaimer"],
        severity: "high",
      },
    });
    expect(parsed.injection.severity).toBe("high");
  });

  it("rejects a proposal with no fields", () => {
    expect(() =>
      ExtractResponseDTOSchema.parse({ proposal: {}, skillsRead: [], injection }),
    ).toThrow();
  });

  it("rejects missing injection", () => {
    expect(() =>
      ExtractResponseDTOSchema.parse({
        proposal: { objective: "Test" },
        skillsRead: [],
      }),
    ).toThrow();
  });
});
