/**
 * rerun.service — read-only re-run strip builder.
 * Why: hash compare + catalog drift; zero Prisma writes (14-backend-design.md).
 */
import {
  hashRun,
  hashRuleset,
  diffRulesets,
  runDeterministic,
  type DetRunRule,
  type HashableRule,
} from "@preflight/rules";
import type { DriftItemDTO, RerunStripDTO } from "@preflight/schemas";

import { getLiveCatalog, getPackageMatch, toHashableRules } from "../../lib/catalog.js";
import { NotFoundError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

function mapDriftItems(items: ReturnType<typeof diffRulesets>): DriftItemDTO[] {
  return items.map((item) => {
    if (item.kind === "definition_changed") {
      return {
        kind: "definition_changed",
        ruleId: item.ruleId,
        frozenWording: item.frozenWording,
        liveWording: item.liveWording,
        changes: item.changes,
      };
    }

    if (item.kind === "rules_added_outside_freeze") {
      return {
        kind: "rules_added_outside_freeze",
        ruleId: item.ruleId,
        liveWording: item.liveWording,
      };
    }

    return {
      kind: "frozen_rule_missing",
      ruleId: item.ruleId,
      frozenWording: item.frozenWording,
    };
  });
}

function bindDetRunRules(snapshots: HashableRule[]): DetRunRule[] {
  return snapshots
    .filter((snapshot) => snapshot.kind === "deterministic")
    .map((snapshot) => {
      const match = getPackageMatch(snapshot.id);

      if (!match) {
        throw new Error(`Deterministic engine error.`);
      }

      return {
        id: snapshot.id,
        kind: "deterministic" as const,
        wording: snapshot.wording,
        predicateFingerprint: snapshot.predicateFingerprint,
        matcherFingerprint: snapshot.matcherFingerprint ?? "",
        match,
      };
    });
}

export async function buildRerunStrip(assetId: string): Promise<RerunStripDTO> {
  const asset = await prisma.asset.findUnique({ where: { id: assetId } });

  if (!asset) {
    throw new NotFoundError("Asset not found");
  }

  const snapshots = await prisma.constraintSnapshot.findMany({
    where: { constraintSetId: asset.constraintSetId },
  });

  const frozen: HashableRule[] = snapshots.map((snapshot) => ({
    id: snapshot.ruleId,
    kind: snapshot.kind as HashableRule["kind"],
    wording: snapshot.wording,
    predicateFingerprint: snapshot.predicateFingerprint,
    matcherFingerprint: snapshot.matcherFingerprint,
  }));

  const liveCatalog = await getLiveCatalog();
  const live = toHashableRules(liveCatalog);
  const detRules = bindDetRunRules(frozen);
  const { findings } = runDeterministic({
    canonicalText: asset.canonicalText,
    rules: detRules,
  });

  const matcherOutputs = findings.map((finding) => ({
    ruleId: finding.ruleId,
    machineVerdict: finding.machineVerdict,
    spans: finding.spans,
  }));

  const rerunHash = hashRun({
    canonicalText: asset.canonicalText,
    rulesetHash: asset.rulesetHash,
    matcherOutputs,
  });

  return {
    runHash: asset.runHash,
    rerunHash,
    hashesMatch: asset.runHash === rerunHash,
    rulesetHash: asset.rulesetHash,
    liveRulesetHash: hashRuleset(live),
    driftItems: mapDriftItems(diffRulesets(frozen, live)),
  };
}
