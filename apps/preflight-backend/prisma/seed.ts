/**
 * seed — seed entrypoint.
 * Why: wipe DB in FK order, insert walkthrough graph, disconnect.
 */
import "dotenv/config";

import { PrismaClient } from "@prisma/client";

import { seedJudgementRules } from "./seed/judgement-rules.js";
import { seedStory } from "./seed/story.js";

const prisma = new PrismaClient();

async function resetDatabase(): Promise<void> {
  await prisma.findingDecision.deleteMany();
  await prisma.finding.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.constraintSnapshot.deleteMany();
  await prisma.campaign.updateMany({ data: { currentConstraintSetId: null } });
  await prisma.constraintSet.deleteMany();
  await prisma.judgementRule.deleteMany();
  await prisma.campaign.deleteMany();
}

async function main(): Promise<void> {
  await resetDatabase();
  await seedJudgementRules(prisma);
  await seedStory(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
