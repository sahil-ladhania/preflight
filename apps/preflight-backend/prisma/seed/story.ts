/**
 * story — campaign, compile freeze, assets A–G, findings.
 * Why: Phase 3 walkthrough orchestrator (14-backend-design.md Area 7).
 */
import type { PrismaClient } from "@prisma/client";
import { hashRuleset, type StructuredBrief } from "@preflight/rules";

import { FROZEN_WORDING } from "./judgement-rules.js";
import { ASSET_A_DEF, buildFindingsA } from "./story-a.js";
import { ASSET_B_DEF, buildFindingsB } from "./story-b.js";
import { ASSET_C_DEF, buildFindingsC } from "./story-c.js";
import { ASSET_D_DEF, buildFindingsD } from "./story-d.js";
import { ASSET_E_DEF, buildFindingsE } from "./story-e.js";
import { ASSET_F_DEF, buildFindingsF, createStoryHelpers } from "./story-f.js";
import { ASSET_G_DEF, buildFindingsG, buildSnapshots } from "./story-g.js";
import { computeRunHash } from "./story-findings.js";
import {
  buildCanonicalText,
  findingId,
  type AssetSeedDef,
  type FindingSeed,
  type StoryHelpers,
} from "./story-h.js";

export type { AssetCopyFields, AssetSeedDef, FindingSeed, StoryHelpers } from "./story-h.js";

export const CAMPAIGN_ID = "22222222-2222-4222-8222-222222222222";
export const CONSTRAINT_SET_ID = "33333333-3333-4333-8333-333333333333";

export const ASSET_IDS = {
  A: ASSET_A_DEF.id,
  B: ASSET_B_DEF.id,
  C: ASSET_C_DEF.id,
  D: ASSET_D_DEF.id,
  E: ASSET_E_DEF.id,
  F: ASSET_F_DEF.id,
  G: ASSET_G_DEF.id,
} as const;

export const W_FROZEN_SEBI_05 = FROZEN_WORDING["SEBI-05"];

const SEED_BRIEF: StructuredBrief = {
  objective: "Drive awareness for Bluepeak Flexi Cap among digital investors.",
  schemeName: "Bluepeak Flexi Cap Fund",
  schemeCategory: "Flexi Cap",
  audience: "Retail investors aged 25–45",
  channels: ["display", "email", "linkedin"],
  market: "India",
  performanceFigures: [{ value: "18.2%", period: "3-year CAGR" }],
  claims: ["Market-leading flexibility", "Strong risk-adjusted outcomes"],
};

const FREEZE_RULE_IDS = [
  "SEBI-01",
  "SEBI-02",
  "SEBI-03",
  "SEBI-04",
  "SEBI-05",
  "SEBI-06",
  "BRAND-02",
  "BRAND-03",
] as const;

interface StoryAssetModule {
  def: AssetSeedDef;
  buildFindings: (canonicalText: string, helpers: StoryHelpers) => FindingSeed[];
}

const STORY_ASSETS: StoryAssetModule[] = [
  { def: ASSET_A_DEF, buildFindings: buildFindingsA },
  { def: ASSET_B_DEF, buildFindings: buildFindingsB },
  { def: ASSET_C_DEF, buildFindings: buildFindingsC },
  { def: ASSET_D_DEF, buildFindings: buildFindingsD },
  { def: ASSET_E_DEF, buildFindings: buildFindingsE },
  { def: ASSET_F_DEF, buildFindings: buildFindingsF },
  { def: ASSET_G_DEF, buildFindings: buildFindingsG },
];

export async function seedStory(prisma: PrismaClient): Promise<void> {
  const snapshots = buildSnapshots(FREEZE_RULE_IDS);
  const rulesetHash = hashRuleset(snapshots);
  const helpers = createStoryHelpers();
  const compileAt = new Date("2026-03-14T08:00:00.000Z");

  await prisma.campaign.create({
    data: {
      id: CAMPAIGN_ID,
      freeText:
        "Bluepeak Flexi Cap — digital campaign for retail investors. Highlight flexibility and performance with professional tone.",
      structuredBrief: SEED_BRIEF,
      createdAt: new Date("2026-03-13T08:00:00.000Z"),
      updatedAt: new Date("2026-03-14T09:00:00.000Z"),
    },
  });

  await prisma.constraintSet.create({
    data: {
      id: CONSTRAINT_SET_ID,
      campaignId: CAMPAIGN_ID,
      rulesetHash,
      createdAt: compileAt,
    },
  });

  for (const snapshot of snapshots) {
    await prisma.constraintSnapshot.create({
      data: {
        constraintSetId: CONSTRAINT_SET_ID,
        ruleId: snapshot.id,
        kind: snapshot.kind,
        wording: snapshot.wording,
        predicateFingerprint: snapshot.predicateFingerprint,
        matcherFingerprint: snapshot.matcherFingerprint,
      },
    });
  }

  await prisma.campaign.update({
    where: { id: CAMPAIGN_ID },
    data: { currentConstraintSetId: CONSTRAINT_SET_ID },
  });

  for (const module of STORY_ASSETS) {
    const { canonicalText, fieldOffsets } = buildCanonicalText(module.def.copy);
    const runHash = computeRunHash(canonicalText, rulesetHash);
    const findings = module.buildFindings(canonicalText, helpers);

    await prisma.asset.create({
      data: {
        id: module.def.id,
        campaignId: CAMPAIGN_ID,
        channel: module.def.channel,
        constraintSetId: CONSTRAINT_SET_ID,
        headline: module.def.copy.headline,
        body: module.def.copy.body,
        disclaimer: module.def.copy.disclaimer,
        cta: module.def.copy.cta,
        canonicalText,
        fieldOffsets,
        runHash,
        rulesetHash,
        generatedAt: new Date(module.def.generatedAt),
        regeneratedFromId: module.def.regeneratedFromId,
        generationIndex: module.def.generationIndex,
        findings: {
          create: findings.map((finding) => ({
            id: findingId(module.def.letter, finding.ruleId),
            ruleId: finding.ruleId,
            kind: finding.kind,
            evaluationStatus: finding.evaluationStatus,
            machineVerdict: finding.machineVerdict,
            machineReason: finding.machineReason,
            spans: finding.spans,
            machineAt: finding.machineAt ? new Date(finding.machineAt) : null,
            humanVerdict: finding.humanVerdict,
            humanReason: finding.humanReason,
            humanActor: finding.humanActor,
            humanAt: finding.humanAt ? new Date(finding.humanAt) : null,
          })),
        },
      },
    });
  }
}
