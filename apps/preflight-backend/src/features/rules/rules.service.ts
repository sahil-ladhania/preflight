/**
 * rules.service — catalog read and judgement CRUD.
 * Why: det id writes → 400.
 */
import { randomUUID } from "node:crypto";

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
import { NotFoundError, ValidationError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";

function assertJudgementRuleId(ruleId: string): void {
  if (isDeterministicRuleId(ruleId)) {
    throw new ValidationError(
      "Deterministic rules are defined in code and cannot be edited.",
    );
  }
}

function judgementRowToDto(row: {
  id: string;
  wording: string;
  predicateSpec: unknown;
}): RuleCatalogRowDTO {
  return toRuleCatalogRow({
    ruleId: row.id,
    kind: "judgement",
    wording: row.wording,
    predicateSpec: PredicateSpecSchema.parse(row.predicateSpec),
  });
}

export async function listRules(): Promise<RulesListResponse> {
  const catalog = await getLiveCatalog();
  return { rules: catalog.map((entry) => toRuleCatalogRow(entry)) };
}

export async function createJudgementRule(
  body: CreateJudgementRuleRequest,
): Promise<RuleCatalogRowDTO> {
  const row = await prisma.judgementRule.create({
    data: {
      id: randomUUID(),
      wording: body.wording,
      predicateSpec: body.predicateSpec,
    },
  });

  return judgementRowToDto(row);
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

  const row = await prisma.judgementRule.update({
    where: { id },
    data: {
      ...(body.wording !== undefined ? { wording: body.wording } : {}),
      ...(body.predicateSpec !== undefined
        ? { predicateSpec: body.predicateSpec }
        : {}),
    },
  });

  return judgementRowToDto(row);
}

export async function deleteJudgementRule(id: string): Promise<void> {
  assertJudgementRuleId(id);

  const existing = await prisma.judgementRule.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError("Judgement rule not found");
  }

  await prisma.judgementRule.delete({ where: { id } });
}
