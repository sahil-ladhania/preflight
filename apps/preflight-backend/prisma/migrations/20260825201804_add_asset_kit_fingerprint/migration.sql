-- Add kitFingerprint with backfill for existing assets (doc 19 §8.3).

ALTER TABLE "Asset" ADD COLUMN "kitFingerprint" TEXT;

UPDATE "Asset"
SET "kitFingerprint" = 'ee486f142f8f420347a9e9f4aff59bfbadae6960bad38495cf7133877740f306'
WHERE "kitFingerprint" IS NULL;

ALTER TABLE "Asset" ALTER COLUMN "kitFingerprint" SET NOT NULL;
