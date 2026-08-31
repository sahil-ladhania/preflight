/**
 * workbench.test — chat request/response schema guards.
 * Why: doc 19 §9.2 history + suggestedAction.
 */
// size: explainer wire + coerce cases in one file per rules-package.mdc
import { describe, expect, it } from "vitest";

import { ExplainerOutputSchema, coerceExplainerOutput } from "./explainer-output.js";
import { WorkbenchChatRequestSchema } from "./workbench.js";

describe("WorkbenchChatRequestSchema", () => {
  it("accepts message only", () => {
    const parsed = WorkbenchChatRequestSchema.parse({
      message: "What is SEBI-01?",
    });
    expect(parsed.message).toBe("What is SEBI-01?");
  });

  it("accepts optional history", () => {
    const parsed = WorkbenchChatRequestSchema.parse({
      message: "Start a campaign",
      history: [{ role: "user", content: "Hi" }],
    });
    expect(parsed.history?.length).toBe(1);
  });
});

describe("ExplainerOutputSchema", () => {
  const completeBrief = {
    objective: "Launch awareness for Bluepeak Flexi Cap.",
    schemeName: "Bluepeak Flexi Cap Fund",
    schemeCategory: "Flexi Cap",
    audience: "HNI investors in India",
    channels: ["email", "linkedin"],
    market: "India",
    performanceFigures: [{ value: "18.2%", period: "3-year CAGR" }],
    claims: ["Flexibility across market caps"],
  };

  it("accepts suggestedAction handoff_campaign with complete brief", () => {
    const parsed = ExplainerOutputSchema.parse({
      message: "Let's start your campaign.",
      ruleIds: [],
      suggestedAction: "handoff_campaign",
      brief: completeBrief,
    });
    expect(parsed.suggestedAction).toBe("handoff_campaign");
    expect(parsed.brief?.schemeName).toBe("Bluepeak Flexi Cap Fund");
  });

  it("accepts partial brief with suggestedAction none", () => {
    const parsed = ExplainerOutputSchema.parse({
      message: "What is the campaign objective?",
      ruleIds: ["SEBI-02"],
      suggestedAction: "none",
      brief: {
        schemeName: "Bluepeak Flexi Cap Fund",
        audience: "HNI investors in India",
        channels: ["email", "linkedin"],
      },
    });
    expect(parsed.brief?.schemeName).toBe("Bluepeak Flexi Cap Fund");
  });

  it("keeps partial brief on coerce during interview", () => {
    const parsed = ExplainerOutputSchema.parse({
      message: "What is the campaign objective?",
      ruleIds: [],
      suggestedAction: "none",
      brief: {
        schemeName: "Bluepeak Flexi Cap Fund",
        channels: ["email"],
      },
    });
    const coerced = coerceExplainerOutput(parsed);
    expect(coerced.suggestedAction).toBe("none");
    expect(coerced.brief?.schemeName).toBe("Bluepeak Flexi Cap Fund");
  });

  it("keeps full brief on coerce when handoff is valid", () => {
    const parsed = ExplainerOutputSchema.parse({
      message: "Let's start your campaign.",
      ruleIds: [],
      suggestedAction: "handoff_campaign",
      brief: completeBrief,
    });
    const coerced = coerceExplainerOutput(parsed);
    expect(coerced.suggestedAction).toBe("handoff_campaign");
    expect(coerced.brief).toEqual(completeBrief);
  });

  it("coerces handoff_campaign to none but keeps draft when brief is incomplete", () => {
    const parsed = ExplainerOutputSchema.parse({
      message: "Almost ready.",
      ruleIds: [],
      suggestedAction: "handoff_campaign",
      brief: {
        schemeName: "Bluepeak Flexi Cap Fund",
        channels: ["email"],
      },
    });
    const coerced = coerceExplainerOutput(parsed);
    expect(coerced.suggestedAction).toBe("none");
    expect(coerced.brief?.schemeName).toBe("Bluepeak Flexi Cap Fund");
  });

  it("coerces handoff_campaign to none when brief is missing", () => {
    const parsed = ExplainerOutputSchema.parse({
      message: "Let's start your campaign.",
      ruleIds: [],
      suggestedAction: "handoff_campaign",
    });
    const coerced = coerceExplainerOutput(parsed);
    expect(coerced.suggestedAction).toBe("none");
    expect(coerced.brief).toBeUndefined();
  });

  it("accepts suggestedAction compile and generate", () => {
    expect(
      ExplainerOutputSchema.parse({
        message: "Save, then freeze constraints.",
        ruleIds: ["SEBI-01"],
        suggestedAction: "compile",
      }).suggestedAction,
    ).toBe("compile");
    expect(
      ExplainerOutputSchema.parse({
        message: "Ready to generate copy.",
        ruleIds: [],
        suggestedAction: "generate",
      }).suggestedAction,
    ).toBe("generate");
  });

  it("strips brief on coerce for compile and generate", () => {
    const compileCoerced = coerceExplainerOutput(
      ExplainerOutputSchema.parse({
        message: "Freeze next.",
        ruleIds: [],
        suggestedAction: "compile",
        brief: { schemeName: "Bluepeak Flexi Cap Fund" },
      }),
    );
    expect(compileCoerced.suggestedAction).toBe("compile");
    expect(compileCoerced.brief).toBeUndefined();

    const generateCoerced = coerceExplainerOutput(
      ExplainerOutputSchema.parse({
        message: "Generate next.",
        ruleIds: [],
        suggestedAction: "generate",
        brief: { schemeName: "Bluepeak Flexi Cap Fund" },
      }),
    );
    expect(generateCoerced.suggestedAction).toBe("generate");
    expect(generateCoerced.brief).toBeUndefined();
  });

  it("rejects unknown suggestedAction", () => {
    expect(() =>
      ExplainerOutputSchema.parse({
        message: "x",
        ruleIds: [],
        suggestedAction: "ship_now",
      }),
    ).toThrow();
  });

  it("accepts valid performanceFigures objects on wire", () => {
    const parsed = ExplainerOutputSchema.parse({
      message: "Captured your performance figure.",
      ruleIds: [],
      suggestedAction: "none",
      brief: {
        schemeName: "Bluepeak Flexi Cap Fund",
        channels: ["email"],
        performanceFigures: [{ value: "14.2% CAGR", period: "3 years" }],
      },
    });
    expect(parsed.brief?.performanceFigures).toEqual([
      { value: "14.2% CAGR", period: "3 years" },
    ]);
  });

  it("drops string performanceFigures elements instead of failing parse", () => {
    const parsed = ExplainerOutputSchema.parse({
      message: "Captured your brief.",
      ruleIds: [],
      suggestedAction: "none",
      brief: {
        schemeName: "Bluepeak Flexi Cap Fund",
        channels: ["email"],
        performanceFigures: ["14.2% CAGR over 3 years"],
      },
    });
    expect(parsed.brief?.performanceFigures).toEqual([]);
  });

  it("keeps valid performanceFigures and drops malformed elements in mixed wire", () => {
    const parsed = ExplainerOutputSchema.parse({
      message: "Captured your brief.",
      ruleIds: [],
      suggestedAction: "none",
      brief: {
        schemeName: "Bluepeak Flexi Cap Fund",
        channels: ["email"],
        performanceFigures: [
          { value: "14.2% CAGR", period: "3 years" },
          "14.2% CAGR over 3 years",
          { value: "x" },
        ],
      },
    });
    expect(parsed.brief?.performanceFigures).toEqual([
      { value: "14.2% CAGR", period: "3 years" },
    ]);
  });

  it("sanitizes empty string brief placeholders from wire JSON", () => {
    const parsed = ExplainerOutputSchema.parse({
      message: "Thank you for the details.",
      ruleIds: [],
      suggestedAction: "none",
      brief: {
        objective: "launch awareness for the flexi cap category",
        schemeName: "",
        schemeCategory: "",
        audience: "HNI investors in India",
        channels: ["linkedin", "email"],
        market: "",
      },
    });
    expect(parsed.brief?.objective).toBe(
      "launch awareness for the flexi cap category",
    );
    expect(parsed.brief?.audience).toBe("HNI investors in India");
    expect(parsed.brief?.channels).toEqual(["linkedin", "email"]);
    expect(parsed.brief?.schemeName).toBeUndefined();
    expect(parsed.brief?.schemeCategory).toBeUndefined();
    expect(parsed.brief?.market).toBeUndefined();

    const coerced = coerceExplainerOutput(parsed);
    expect(coerced.suggestedAction).toBe("none");
    expect(coerced.brief?.channels).toEqual(["linkedin", "email"]);
  });
});
