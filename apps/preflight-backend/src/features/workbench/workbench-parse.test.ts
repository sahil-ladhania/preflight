/**
 * workbench-parse.test — explainer JSON parse and brief salvage.
 */
import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import * as schemas from "@preflight/schemas";

import { parseExplainerOutput } from "./workbench-parse.js";

describe("parseExplainerOutput", () => {
  it("parses a valid brief without dropping fields", () => {
    const { response, droppedBrief } = parseExplainerOutput(
      JSON.stringify({
        message: "Brief captured.",
        ruleIds: ["SEBI-01"],
        suggestedAction: "none",
        brief: {
          objective: "Awareness push",
          schemeName: "Bluepeak Flexi Cap Fund",
          schemeCategory: "Flexi Cap",
          audience: "Retail investors",
          market: "India",
          channels: ["linkedin", "email"],
          performanceFigures: [{ value: "14.2% CAGR", period: "3 years" }],
        },
      }),
    );

    expect(droppedBrief).toBe(false);
    expect(response.message).toBe("Brief captured.");
    expect(response.brief?.channels).toEqual(["linkedin", "email"]);
    expect(response.brief?.performanceFigures).toEqual([
      { value: "14.2% CAGR", period: "3 years" },
    ]);
  });

  it("normalizes natural-language channels without dropping brief", () => {
    const { response, droppedBrief } = parseExplainerOutput(
      JSON.stringify({
        message: "Channels captured.",
        ruleIds: [],
        brief: {
          schemeName: "Bluepeak Flexi Cap Fund",
          channels: ["LinkedIn", "email newsletter"],
        },
      }),
    );

    expect(droppedBrief).toBe(false);
    expect(response.brief?.channels).toEqual(["linkedin", "email"]);
  });

  it("drops string performanceFigures without salvage", () => {
    const { response, droppedBrief } = parseExplainerOutput(
      JSON.stringify({
        message: "Figures captured.",
        ruleIds: [],
        brief: {
          schemeName: "Bluepeak Flexi Cap Fund",
          channels: ["email"],
          performanceFigures: ["14.2% CAGR over 3 years"],
        },
      }),
    );

    expect(droppedBrief).toBe(false);
    expect(response.brief?.performanceFigures).toEqual([]);
  });

  it("throws on non-JSON content", () => {
    expect(() => parseExplainerOutput("not json")).toThrow();
  });

  it("throws on extra top-level keys even when brief is present", () => {
    expect(() =>
      parseExplainerOutput(
        JSON.stringify({
          message: "Hello",
          ruleIds: [],
          extraTopLevel: true,
          brief: { schemeName: "Bluepeak Flexi Cap Fund", channels: ["email"] },
        }),
      ),
    ).toThrow();
  });

  it("salvages message and ruleIds when brief parse fails", () => {
    const realParse = schemas.parseExplainerWireOutput;
    const spy = vi
      .spyOn(schemas, "parseExplainerWireOutput")
      .mockImplementationOnce(() => {
        throw new ZodError([
          {
            code: "custom",
            path: ["brief", "channels", 0],
            message: "Invalid enum value",
          },
        ]);
      })
      .mockImplementation((wire: unknown) => realParse(wire));

    const { response, droppedBrief } = parseExplainerOutput(
      JSON.stringify({
        message: "Captured your brief.",
        ruleIds: ["SEBI-01"],
        suggestedAction: "none",
        brief: {
          schemeName: "Bluepeak Flexi Cap Fund",
          channels: ["linkedin"],
        },
      }),
    );

    spy.mockRestore();

    expect(droppedBrief).toBe(true);
    expect(response.message).toBe("Captured your brief.");
    expect(response.ruleIds).toEqual(["SEBI-01"]);
    expect(response.suggestedAction).toBe("none");
    expect(response.brief).toBeUndefined();
  });
});
