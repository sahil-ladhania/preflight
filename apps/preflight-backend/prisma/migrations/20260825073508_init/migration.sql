-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "freeText" TEXT NOT NULL DEFAULT '',
    "structuredBrief" JSONB,
    "currentConstraintSetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstraintSet" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "rulesetHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConstraintSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstraintSnapshot" (
    "constraintSetId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "wording" TEXT NOT NULL,
    "predicateFingerprint" TEXT NOT NULL,
    "matcherFingerprint" TEXT,

    CONSTRAINT "ConstraintSnapshot_pkey" PRIMARY KEY ("constraintSetId","ruleId")
);

-- CreateTable
CREATE TABLE "JudgementRule" (
    "id" TEXT NOT NULL,
    "wording" TEXT NOT NULL,
    "predicateSpec" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JudgementRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "constraintSetId" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "disclaimer" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "canonicalText" TEXT NOT NULL,
    "fieldOffsets" JSONB NOT NULL,
    "runHash" TEXT NOT NULL,
    "rulesetHash" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "regeneratedFromId" TEXT,
    "generationIndex" INTEGER NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finding" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "evaluationStatus" TEXT NOT NULL,
    "machineVerdict" TEXT,
    "machineReason" TEXT,
    "spans" JSONB NOT NULL,
    "machineAt" TIMESTAMP(3),
    "humanVerdict" TEXT,
    "humanReason" TEXT,
    "humanActor" TEXT,
    "humanAt" TIMESTAMP(3),

    CONSTRAINT "Finding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Campaign_updatedAt_idx" ON "Campaign"("updatedAt");

-- CreateIndex
CREATE INDEX "Asset_generatedAt_idx" ON "Asset"("generatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Finding_assetId_ruleId_key" ON "Finding"("assetId", "ruleId");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_currentConstraintSetId_fkey" FOREIGN KEY ("currentConstraintSetId") REFERENCES "ConstraintSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstraintSet" ADD CONSTRAINT "ConstraintSet_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConstraintSnapshot" ADD CONSTRAINT "ConstraintSnapshot_constraintSetId_fkey" FOREIGN KEY ("constraintSetId") REFERENCES "ConstraintSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_constraintSetId_fkey" FOREIGN KEY ("constraintSetId") REFERENCES "ConstraintSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_regeneratedFromId_fkey" FOREIGN KEY ("regeneratedFromId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finding" ADD CONSTRAINT "Finding_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
