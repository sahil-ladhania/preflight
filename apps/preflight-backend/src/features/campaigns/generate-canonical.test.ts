/**
 * generate-canonical.test — offset proof for buildCanonicalText.
 */
import assert from "node:assert/strict";
import test from "node:test";

import { buildCanonicalText, FIELD_DELIMITER } from "./generate-canonical.js";

test("buildCanonicalText offsets slice back to fields", () => {
  const fields = {
    headline: "Headline",
    body: "Body copy",
    disclaimer: "Disclaimer line",
    cta: "Invest",
  };
  const { canonicalText, fieldOffsets } = buildCanonicalText(fields);

  assert.equal(
    canonicalText.slice(fieldOffsets.headline.start, fieldOffsets.headline.end),
    fields.headline,
  );
  assert.equal(
    canonicalText.slice(fieldOffsets.body.start, fieldOffsets.body.end),
    fields.body,
  );
  assert.equal(
    canonicalText.slice(fieldOffsets.disclaimer.start, fieldOffsets.disclaimer.end),
    fields.disclaimer,
  );
  assert.equal(
    canonicalText.slice(fieldOffsets.cta.start, fieldOffsets.cta.end),
    fields.cta,
  );
  assert.equal(canonicalText.split(FIELD_DELIMITER).length, 4);
});
