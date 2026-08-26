-- CreateTable
CREATE TABLE "RulebookChange" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "prevWording" TEXT,
    "nextWording" TEXT,
    "prevPredicateSpec" JSONB,
    "nextPredicateSpec" JSONB,
    "actor" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RulebookChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RulebookChange_ruleId_at_idx" ON "RulebookChange"("ruleId", "at");
