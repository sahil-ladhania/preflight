/**
 * workbench.test — chat request/response schema guards.
 * Why: doc 19 §9.2 history + suggestedAction.
 */
import { describe, expect, it } from "vitest";

import { ExplainerOutputSchema } from "./explainer-output.js";
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
  it("accepts suggestedAction handoff_campaign", () => {
    const parsed = ExplainerOutputSchema.parse({
      message: "Let's start your campaign.",
      ruleIds: [],
      suggestedAction: "handoff_campaign",
    });
    expect(parsed.suggestedAction).toBe("handoff_campaign");
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
