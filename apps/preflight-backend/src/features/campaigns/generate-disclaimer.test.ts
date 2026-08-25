/**
 * generate-disclaimer.test — SEBI-01 disclaimer safety net.
 */
import assert from "node:assert/strict";
import test from "node:test";

import { ensureSebi01Disclaimer } from "./generate-disclaimer.js";

const base = {
  headline: "Headline",
  body: "Body copy.",
  disclaimer: "Other text.",
  cta: "Learn more",
};

test("ensureSebi01Disclaimer leaves copy when rule not pinned", () => {
  assert.deepEqual(ensureSebi01Disclaimer(base, false), base);
});

test("ensureSebi01Disclaimer prepends required phrase when missing", () => {
  const result = ensureSebi01Disclaimer(base, true);
  assert.match(result.disclaimer, /Mutual fund investments are subject to market risks/i);
});

test("ensureSebi01Disclaimer skips when phrase already present", () => {
  const withPhrase = {
    ...base,
    disclaimer: "Mutual fund investments are subject to market risks. Read scheme documents.",
  };
  assert.deepEqual(ensureSebi01Disclaimer(withPhrase, true), withPhrase);
});
