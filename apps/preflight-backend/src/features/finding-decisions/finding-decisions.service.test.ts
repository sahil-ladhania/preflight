/**
 * finding-decisions.service.test — buildDecisionRowData shape.
 * Why: G-02 human audit trail row builder.
 */
import assert from "node:assert/strict";
import test from "node:test";

import type { HumanVerdict } from "@preflight/schemas";

import { buildDecisionRowData } from "./finding-decisions.service.js";

const AT = new Date("2026-03-15T11:10:00.000Z");

test("buildDecisionRowData maps waive action", () => {
  const row = buildDecisionRowData(
    {
      findingId: "f-1",
      action: "waive",
      previousVerdict: null,
      verdict: "waived",
      reason: "Demo exception.",
      actor: "Demo Operator",
      at: AT,
    },
    "dec-1",
  );

  assert.equal(row.action, "waive");
  assert.equal(row.verdict, "waived");
  assert.equal(row.previousVerdict, null);
  assert.equal(row.reason, "Demo exception.");
});

test("buildDecisionRowData maps confirm with null reason", () => {
  const row = buildDecisionRowData(
    {
      findingId: "f-1",
      action: "confirm",
      previousVerdict: null,
      verdict: "confirmed",
      reason: null,
      actor: "Demo Operator",
      at: AT,
    },
    "dec-2",
  );

  assert.equal(row.action, "confirm");
  assert.equal(row.verdict, "confirmed");
  assert.equal(row.reason, null);
});

test("buildDecisionRowData maps retry with null verdict and reason", () => {
  const row = buildDecisionRowData(
    {
      findingId: "f-1",
      action: "retry",
      previousVerdict: "waived" as HumanVerdict,
      verdict: null,
      reason: null,
      actor: "Demo Operator",
      at: AT,
    },
    "dec-3",
  );

  assert.equal(row.action, "retry");
  assert.equal(row.verdict, null);
  assert.equal(row.reason, null);
  assert.equal(row.previousVerdict, "waived");
});

test("buildDecisionRowData carries previousVerdict on override", () => {
  const row = buildDecisionRowData(
    {
      findingId: "f-1",
      action: "override",
      previousVerdict: "waived",
      verdict: "overridden",
      reason: "Machine was wrong.",
      actor: "Demo Operator",
      at: AT,
    },
    "dec-4",
  );

  assert.equal(row.previousVerdict, "waived");
  assert.equal(row.verdict, "overridden");
});
