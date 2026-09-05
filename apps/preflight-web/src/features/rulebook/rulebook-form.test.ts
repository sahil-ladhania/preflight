/**
 * rulebook-form.test — sheet validation and applicability preview helpers.
 */

import { describe, expect, it } from "vitest";

import {
  emptyJudgementForm,
  formIsValid,
  formatPredicateSpec,
  saveBlockedReason,
  updateRequestFromForm,
} from "@/features/rulebook/lib";

function filledForm() {
  return {
    ...emptyJudgementForm(),
    wording: "Brand voice must stay professional.",
    op: "in" as const,
    valueText: "linkedin, email",
    changeReason: "Aligning with channel tone guidance.",
  };
}

describe("saveBlockedReason", () => {
  it("names missing wording first on add", () => {
    expect(saveBlockedReason(emptyJudgementForm(), "add")).toBe(
      "Add rule wording before saving.",
    );
  });

  it("names missing applicability on add", () => {
    expect(
      saveBlockedReason(
        {
          ...emptyJudgementForm(),
          wording: "Tone must match norms.",
          changeReason: "Aligning with channel tone guidance.",
        },
        "add",
      ),
    ).toBe("Enter an applicability value above.");
  });

  it("names short change reason on edit", () => {
    expect(
      saveBlockedReason(
        {
          ...emptyJudgementForm(),
          wording: "Brand voice must stay professional.",
          changeReason: "short",
        },
        "edit",
      ),
    ).toBe("Add a change reason of at least 10 characters.");
  });

  it("returns null when add form is complete", () => {
    expect(saveBlockedReason(filledForm(), "add")).toBeNull();
  });
});

describe("formIsValid", () => {
  it("allows edit save without applicability value in form", () => {
    expect(
      formIsValid(
        {
          ...emptyJudgementForm(),
          wording: "Brand voice must stay professional.",
          valueText: "",
          changeReason: "Aligning with channel tone guidance.",
        },
        "edit",
      ),
    ).toBe(true);
  });

  it("requires predicate on add", () => {
    expect(
      formIsValid(
        {
          ...emptyJudgementForm(),
          wording: "Brand voice must stay professional.",
          changeReason: "Aligning with channel tone guidance.",
        },
        "add",
      ),
    ).toBe(false);
  });
});

describe("updateRequestFromForm", () => {
  it("omits predicateSpec when value cannot be parsed", () => {
    const body = updateRequestFromForm({
      ...emptyJudgementForm(),
      wording: "Brand voice must stay professional.",
      valueText: "",
      changeReason: "Aligning with channel tone guidance.",
    });
    expect(body).toEqual({
      wording: "Brand voice must stay professional.",
      changeReason: "Aligning with channel tone guidance.",
    });
  });

  it("includes predicateSpec when value parses", () => {
    const body = updateRequestFromForm(filledForm());
    expect(body?.predicateSpec).toEqual({
      field: "channels",
      op: "in",
      value: ["linkedin", "email"],
    });
  });
});

describe("formatPredicateSpec", () => {
  it("builds channel preview strings", () => {
    expect(
      formatPredicateSpec({
        field: "channels",
        op: "in",
        value: ["linkedin", "email"],
      }),
    ).toBe("Campaigns on LinkedIn or email");
  });
});
