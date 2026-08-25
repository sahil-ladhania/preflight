/**
 * brand-kit.test — stable fingerprint for Bluepeak fixture.
 * Why: doc 19 §8.1 kitFingerprint must be reproducible.
 */
import assert from "node:assert/strict";
import test from "node:test";

import { kitFingerprint, loadBrandKit, resolveBrandKit } from "./brand-kit.js";

test("loadBrandKit returns bluepeak-v1", () => {
  const kit = loadBrandKit();
  assert.equal(kit.kitId, "bluepeak-v1");
  assert.equal(kit.clientName, "Bluepeak Asset Management");
  assert.ok(kit.requiredDisclaimer.length > 0);
});

test("kitFingerprint is stable 64-char hex", () => {
  const first = kitFingerprint();
  const second = kitFingerprint();
  assert.match(first, /^[a-f0-9]{64}$/);
  assert.equal(first, second);
});

test("resolveBrandKit returns kit for known fingerprint", () => {
  const kit = resolveBrandKit(kitFingerprint());
  assert.equal(kit.kitId, "bluepeak-v1");
});

test("resolveBrandKit rejects unknown fingerprint", () => {
  assert.throws(
    () => resolveBrandKit("0".repeat(64)),
    (error: unknown) => error instanceof Error && error.message === "Brand kit not found.",
  );
});
