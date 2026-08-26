/**
 * rules.service — catalog read and judgement CRUD.
 * Why: det id writes → 400; G-04 audit in same transaction.
 */
import { randomUUID } from "node:crypto";

import type { Prisma, RulebookChange } from "@prisma/client";
import type {
  CreateJudgementRuleRequest,
  RuleCatalogRowDTO,
  RulesListResponse,
  UpdateJudgementRuleRequest,
} from "@preflight/schemas";
import { PredicateSpecSchema } from "@preflight/schemas";

import {
  getLiveCatalog,
  isDeterministicRuleId,
  toRuleCatalogRow,
} from "../../lib/catalog.js";
import { env } from "../../config/env.js";
import { NotFoundError, ValidationError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { toRulebookChangeSummary } from "../rulebook-changes/rulebook-change-dto.js";
import { buildRulebookChangeRowData } from "../rulebook-changes/rulebook-changes.service.js";

function assertJudgementRuleId(ruleId: string): void {
  if (isDeterministicRuleId(ruleId)) {
    throw new ValidationError(
      "Deterministic rules are defined in code and cannot be edited.",
    );
  }
}

function judgementRowToDto(
  row: {
    id: string;
    wording: string;
    predicateSpec: unknown;
  },
  lastChange: RulebookChange | null = null,
): RuleCatalogRowDTO {
  return {
    ...toRuleCatalogRow({
      ruleId: row.id,
      kind: "judgement",
      wording: row.wording,
      predicateSpec: PredicateSpecSchema.parse(row.predicateSpec),
    }),
    lastChange: lastChange === null ? null : toRulebookChangeSummary(lastChange),
  };
}

async function loadLatestChangesByRuleId(
  ruleIds: string[],
): Promise<Map<string, RulebookChange>> {
  if (ruleIds.length === 0) {
    return new Map();
  }

  const rows = await prisma.rulebookChange.findMany({
    where: { ruleId: { in: ruleIds } },
    orderBy: { at: "desc" },
  });

  const latest = new Map<string, RulebookChange>();
  for (const row of rows) {
    if (!latest.has(row.ruleId)) {
      latest.set(row.ruleId, row);
    }
  }

  return latest;
}

function writeChange(
  input: Parameters<typeof buildRulebookChangeRowData>[0],
): Prisma.Prisma__RulebookChangeClient<RulebookChange> {
  return prisma.rulebookChange.create({
    data: buildRulebookChangeRowData(input, randomUUID()),
  });
}

export async function listRules(): Promise<RulesListResponse> {
  const catalog = await getLiveCatalog();
  const judgementIds = catalog
    .filter((entry) => entry.kind === "judgement")
    .map((entry) => entry.ruleId);
  const latestByRuleId = await loadLatestChangesByRuleId(judgementIds);

  const rules = catalog.map((entry) => {
    const row = toRuleCatalogRow(entry);
    if (entry.kind !== "judgement") {
      return row;
    }

    const change = latestByRuleId.get(entry.ruleId) ?? null;
    return {
      ...row,
      lastChange: change === null ? null : toRulebookChangeSummary(change),
    };
  });

  return { rules };
}

export async function createJudgementRule(
  body: CreateJudgementRuleRequest,
): Promise<RuleCatalogRowDTO> {
  const ruleId = randomUUID();
  const now = new Date();

  const [row, change] = await prisma.$transaction([
    prisma.judgementRule.create({
      data: {
        id: ruleId,
        wording: body.wording,
        predicateSpec: body.predicateSpec,
      },
    }),
    writeChange({
      ruleId,
      action: "create",
      prevWording: null,
      nextWording: body.wording,
      prevPredicateSpec: null,
      nextPredicateSpec: body.predicateSpec,
      actor: env.DEMO_OPERATOR_NAME,
      reason: body.changeReason,
      at: now,
    }),
  ]);

  return judgementRowToDto(row, change);
}

export async function updateJudgementRule(
  id: string,
  body: UpdateJudgementRuleRequest,
): Promise<RuleCatalogRowDTO> {
  assertJudgementRuleId(id);

  const existing = await prisma.judgementRule.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError("Judgement rule not found");
  }

  const nextWording = body.wording ?? existing.wording;
  const nextPredicateSpec =
    body.predicateSpec ??
    PredicateSpecSchema.parse(existing.predicateSpec);
  const now = new Date();

  const [row, change] = await prisma.$transaction([
    prisma.judgementRule.update({
      where: { id },
      data: {
        ...(body.wording !== undefined ? { wording: body.wording } : {}),
        ...(body.predicateSpec !== undefined
          ? { predicateSpec: body.predicateSpec }
          : {}),
      },
    }),
    writeChange({
      ruleId: id,
      action: "update",
      prevWording: existing.wording,
      nextWording,
      prevPredicateSpec: existing.predicateSpec as Prisma.InputJsonValue,
      nextPredicateSpec,
      actor: env.DEMO_OPERATOR_NAME,
      reason: body.changeReason,
      at: now,
    }),
  ]);

  return judgementRowToDto(row, change);
}

export async function deleteJudgementRule(
  id: string,
  changeReason: string,
): Promise<void> {
  assertJudgementRuleId(id);

  const existing = await prisma.judgementRule.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError("Judgement rule not found");
  }

  const now = new Date();

  await prisma.$transaction([
    writeChange({
      ruleId: id,
      action: "delete",
      prevWording: existing.wording,
      nextWording: null,
      prevPredicateSpec: existing.predicateSpec as Prisma.InputJsonValue,
      nextPredicateSpec: null,
      actor: env.DEMO_OPERATOR_NAME,
      reason: changeReason,
      at: now,
    }),
    prisma.judgementRule.delete({ where: { id } }),
  ]);
}
