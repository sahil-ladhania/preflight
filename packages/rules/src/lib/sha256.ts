/**
 * sha256 — hex digest helper for hashRuleset / hashRun / fingerprints.
 * Why: node:crypto only — zero runtime deps (11-dependencies.md).
 */
import { createHash } from "node:crypto";

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}
