-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "generatorRunId" TEXT;

-- AlterTable
ALTER TABLE "Finding" ADD COLUMN     "judgeRunId" TEXT;

-- CreateTable
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "agentDefVersion" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "linkageKind" TEXT NOT NULL,
    "linkageId" TEXT,
    "promptHash" TEXT NOT NULL,
    "outputHash" TEXT NOT NULL,
    "promptPreview" TEXT NOT NULL,
    "outputPreview" TEXT NOT NULL,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "totalTokens" INTEGER,
    "costUsd" DOUBLE PRECISION,
    "latencyMs" INTEGER NOT NULL,
    "skillsRead" JSONB NOT NULL,
    "injectionSignals" JSONB NOT NULL,
    "chatFlags" JSONB NOT NULL,
    "ok" BOOLEAN NOT NULL,
    "errorKind" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AgentRun_agentName_occurredAt_idx" ON "AgentRun"("agentName", "occurredAt");

-- CreateIndex
CREATE INDEX "AgentRun_linkageKind_linkageId_idx" ON "AgentRun"("linkageKind", "linkageId");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_generatorRunId_fkey" FOREIGN KEY ("generatorRunId") REFERENCES "AgentRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finding" ADD CONSTRAINT "Finding_judgeRunId_fkey" FOREIGN KEY ("judgeRunId") REFERENCES "AgentRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
