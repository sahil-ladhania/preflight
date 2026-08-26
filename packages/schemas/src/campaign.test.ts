/**
 * campaign.test — generate response skillsRead is server-attached.
 * Why: model JSON stays four strings; HTTP DTO lists read paths.
 */
import { describe, expect, it } from "vitest";

import { GenerateResponseDTOSchema } from "./campaign.js";

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
