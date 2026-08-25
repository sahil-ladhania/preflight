/**
 * brand-kit — load Bluepeak fixture, fingerprint, resolve by hash.
 * Why: doc 19 §8.1; kit at generate time, not a DB table.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BrandKitDTOSchema, type BrandKitDTO } from "@preflight/schemas";

import { NotFoundError } from "./http-error.js";

const FIXTURE_PATH = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "../fixtures/bluepeak-brand-kit.json",
);

let cachedKit: BrandKitDTO | undefined;
let cachedFingerprint: string | undefined;

function readFixtureRaw(): string {
  return readFileSync(FIXTURE_PATH, "utf8");
}

function stableKitJson(kit: BrandKitDTO): string {
  return JSON.stringify(kit);
}

export function loadBrandKit(): BrandKitDTO {
  if (!cachedKit) {
    const raw: unknown = JSON.parse(readFixtureRaw());
    cachedKit = BrandKitDTOSchema.parse(raw);
  }

  return cachedKit;
}

export function kitFingerprint(): string {
  if (!cachedFingerprint) {
    cachedFingerprint = createHash("sha256")
      .update(stableKitJson(loadBrandKit()))
      .digest("hex");
  }

  return cachedFingerprint;
}

export function resolveBrandKit(fingerprint: string): BrandKitDTO {
  if (fingerprint !== kitFingerprint()) {
    throw new NotFoundError("Brand kit not found.");
  }

  return loadBrandKit();
}
