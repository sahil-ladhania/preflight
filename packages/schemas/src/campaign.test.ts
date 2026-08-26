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
  it("wraps the proposal without flattening it", () => {
    const parsed = ExtractResponseDTOSchema.parse({
      proposal: { objective: "Launch awareness" },
      skillsRead: ["skills/brief-structure/SKILL.md"],
    });
    expect(parsed.proposal).toEqual({ objective: "Launch awareness" });
    expect(parsed.skillsRead).toEqual(["skills/brief-structure/SKILL.md"]);
  });

  it("accepts empty skillsRead", () => {
    const parsed = ExtractResponseDTOSchema.parse({
      proposal: { schemeName: "Bluepeak Flexi Cap Fund" },
      skillsRead: [],
    });
    expect(parsed.skillsRead).toEqual([]);
  });

  it("rejects a proposal with no fields", () => {
    expect(() =>
      ExtractResponseDTOSchema.parse({ proposal: {}, skillsRead: [] }),
    ).toThrow();
  });
});
