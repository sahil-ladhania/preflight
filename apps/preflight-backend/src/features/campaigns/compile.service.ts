/**
 * compile.service — compile predicates on saved brief.
 * Why: ConstraintSet + snapshots (14-backend-design.md Area 3).
 */
import {
  appliesSpec,
  hashRuleset,
  type StructuredBrief,
} from "@preflight/rules";
import type {
  CompileResponseDTO,
  CompileRuleCardDTO,
  LastCompileDTO,
  StructuredBriefInput,
} from "@preflight/schemas";
import { StructuredBriefSchema } from "@preflight/schemas";

import { getLiveCatalog, toHashableRules } from "../../lib/catalog.js";
import { NotFoundError, ValidationError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { toStructuredBrief } from "./brief-adapter.js";

type CatalogEntry = Awaited<ReturnType<typeof getLiveCatalog>>[number];

function buildApplicabilityReason(
  brief: StructuredBrief,
  entry: CatalogEntry,
): string {
  if (entry.kind === "deterministic") {
    switch (entry.ruleId) {
      case "SEBI-01":
        return `Applies because channel includes ${brief.channels.join(" or ")}.`;
      case "SEBI-02":
        return "Applies because scheme name is present in brief.";
      case "SEBI-03":
        return "Applies because performance figures include CAGR.";
      case "SEBI-04":
        return "Applies to all channels in this brief.";
      case "SEBI-05":
        return "Applies because performance figures are listed.";
      default:
        return "Applies to this brief.";
    }
  }

  const spec = entry.predicateSpec;
  if (!spec) {
    return "Applies to this brief.";
  }

  if (spec.field === "channels") {
    const values = Array.isArray(spec.value) ? spec.value.join(" or ") : spec.value;
    return `Applies because channel includes ${values}.`;
  }

  if (spec.field === "claims") {
    return "Applies because claims array is non-empty.";
  }

  return `Applies because ${spec.field} matches this brief.`;
}

function buildCompileRuleCards(
  brief: StructuredBrief,
  matched: CatalogEntry[],
): CompileRuleCardDTO[] {
  return matched.map((entry) => ({
    ruleId: entry.ruleId,
    kind: entry.kind,
    wording: entry.wording,
    applicabilityReason: buildApplicabilityReason(brief, entry),
  }));
}

function matchedRules(
  catalog: CatalogEntry[],
  brief: StructuredBrief,
): CatalogEntry[] {
  return catalog.filter((entry) => {
    if (entry.kind === "deterministic" && entry.applies) {
      return entry.applies(brief);
    }

    if (entry.kind === "judgement" && entry.predicateSpec) {
      return appliesSpec(brief, entry.predicateSpec);
    }

    return false;
  });
}

export async function loadLastCompile(
  constraintSetId: string,
  structuredBrief: StructuredBriefInput,
): Promise<LastCompileDTO> {
  const constraintSet = await prisma.constraintSet.findUnique({
    where: { id: constraintSetId },
  });

  if (!constraintSet) {
    throw new NotFoundError("Campaign not found");
  }

  const snapshots = await prisma.constraintSnapshot.findMany({
    where: { constraintSetId },
  });
  const catalog = await getLiveCatalog();
  const catalogById = new Map(catalog.map((entry) => [entry.ruleId, entry]));
  const brief = toStructuredBrief(structuredBrief);

  const frozenEntries = snapshots
    .map((snapshot) => catalogById.get(snapshot.ruleId))
    .filter((entry): entry is CatalogEntry => entry !== undefined);

  const rules = buildCompileRuleCards(brief, frozenEntries);

  return {
    constraintSetId,
    rulesetHash: constraintSet.rulesetHash,
    ruleIds: snapshots.map((snapshot) => snapshot.ruleId),
    rules,
  };
}

export async function compileCampaign(
  campaignId: string,
): Promise<CompileResponseDTO> {
  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });

  if (!campaign) {
    throw new NotFoundError("Campaign not found");
  }

  if (campaign.structuredBrief === null) {
    throw new ValidationError("Save brief first.");
  }

  const structuredBrief = StructuredBriefSchema.parse(campaign.structuredBrief);
  const brief = toStructuredBrief(structuredBrief);
  const catalog = await getLiveCatalog();
  const matched = matchedRules(catalog, brief);
  const hashable = toHashableRules(matched);
  const rulesetHash = hashRuleset(hashable);
  const rules = buildCompileRuleCards(brief, matched);

  const constraintSet = await prisma.$transaction(async (tx) => {
    const created = await tx.constraintSet.create({
      data: { campaignId, rulesetHash },
    });

    for (const entry of matched) {
      const hashRow = hashable.find((row) => row.id === entry.ruleId);
      if (!hashRow) {
        continue;
      }

      await tx.constraintSnapshot.create({
        data: {
          constraintSetId: created.id,
          ruleId: entry.ruleId,
          kind: entry.kind,
          wording: entry.wording,
          predicateFingerprint: hashRow.predicateFingerprint,
          matcherFingerprint: hashRow.matcherFingerprint,
        },
      });
    }

    await tx.campaign.update({
      where: { id: campaignId },
      data: { currentConstraintSetId: created.id },
    });

    return created;
  });

  return {
    constraintSetId: constraintSet.id,
    rulesetHash,
    ruleIds: matched.map((entry) => entry.ruleId),
    rules,
  };
}
