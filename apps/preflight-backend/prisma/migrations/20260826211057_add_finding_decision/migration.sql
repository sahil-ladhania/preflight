-- CreateTable
CREATE TABLE "FindingDecision" (
    "id" TEXT NOT NULL,
    "findingId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "previousVerdict" TEXT,
    "verdict" TEXT,
    "reason" TEXT,
    "actor" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FindingDecision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FindingDecision_findingId_at_idx" ON "FindingDecision"("findingId", "at");

-- AddForeignKey
ALTER TABLE "FindingDecision" ADD CONSTRAINT "FindingDecision_findingId_fkey" FOREIGN KEY ("findingId") REFERENCES "Finding"("id") ON DELETE CASCADE ON UPDATE CASCADE;
