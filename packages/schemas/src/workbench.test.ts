/**
 * workbench.test — chat request/response schema guards.
 * Why: doc 19 §9.2 history + suggestedAction.
 */
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

  it("strips partial brief on coerce when not handoff", () => {
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
    expect(coerced.brief).toBeUndefined();
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

  it("coerces handoff_campaign to none when brief is incomplete", () => {
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
    expect(coerced.brief).toBeUndefined();
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

  it("rejects unknown suggestedAction", () => {
    expect(() =>
      ExplainerOutputSchema.parse({
        message: "x",
        ruleIds: [],
        suggestedAction: "ship_now",
      }),
    ).toThrow();
  });
});
