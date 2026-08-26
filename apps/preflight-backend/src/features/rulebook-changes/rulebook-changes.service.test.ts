/**
 * rulebook-changes.service.test — buildRulebookChangeRowData shape.
 * Why: G-04 live catalog audit row builder.
 */
import assert from "node:assert/strict";
import test from "node:test";

import { buildRulebookChangeRowData } from "./rulebook-changes.service.js";

const AT = new Date("2026-03-13T08:00:00.000Z");
const PREDICATE = { field: "channels", op: "equals", value: "email" };

test("buildRulebookChangeRowData maps create with null prev", () => {
  const row = buildRulebookChangeRowData(
    {
      ruleId: "rule-1",
      action: "create",
      prevWording: null,
      nextWording: "New wording.",
      prevPredicateSpec: null,
      nextPredicateSpec: PREDICATE,
      actor: "Demo Operator",
      reason: "Initial catalogue entry.",
      at: AT,
    },
    "chg-1",
  );

  assert.equal(row.action, "create");
  assert.equal(row.prevWording, null);
  assert.equal(row.nextWording, "New wording.");
  assert.equal(row.prevPredicateSpec, undefined);
});

test("buildRulebookChangeRowData maps update with both sides", () => {
  const row = buildRulebookChangeRowData(
    {
      ruleId: "rule-1",
      action: "update",
      prevWording: "Old.",
      nextWording: "New.",
      prevPredicateSpec: PREDICATE,
      nextPredicateSpec: { field: "channels", op: "in", value: ["email"] },
      actor: "Demo Operator",
      reason: "Clarified applicability.",
      at: AT,
    },
    "chg-2",
  );

  assert.equal(row.action, "update");
  assert.equal(row.prevWording, "Old.");
  assert.equal(row.nextWording, "New.");
});

test("buildRulebookChangeRowData maps delete with null next", () => {
  const row = buildRulebookChangeRowData(
    {
      ruleId: "rule-1",
      action: "delete",
      prevWording: "Old.",
      nextWording: null,
      prevPredicateSpec: PREDICATE,
      nextPredicateSpec: null,
      actor: "Demo Operator",
      reason: "Rule retired from live catalog.",
      at: AT,
    },
    "chg-3",
  );

  assert.equal(row.action, "delete");
  assert.equal(row.nextWording, null);
  assert.equal(row.nextPredicateSpec, undefined);
});
