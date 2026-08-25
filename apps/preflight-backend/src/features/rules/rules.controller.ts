/**
 * rules.controller — Rulebook HTTP handlers.
 * Why: try/catch → ApiResponse envelope.
 */
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import {
  CreateJudgementRuleRequestSchema,
  UpdateJudgementRuleRequestSchema,
} from "@preflight/schemas";

import {
  createJudgementRule,
  deleteJudgementRule,
  listRules,
  updateJudgementRule,
} from "./rules.service.js";
import { HttpError } from "../../lib/http-error.js";

function handleError(
  err: unknown,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: err.issues[0]?.message ?? "Invalid request",
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ success: false, error: err.message });
    return;
  }

  next(err);
}

export async function listRulesHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await listRules();
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}

export async function createJudgementRuleHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = CreateJudgementRuleRequestSchema.parse(req.body);
    const data = await createJudgementRule(body);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}

export async function updateJudgementRuleHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = UpdateJudgementRuleRequestSchema.parse(req.body);
    const data = await updateJudgementRule(req.params.id, body);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}

export async function deleteJudgementRuleHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await deleteJudgementRule(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}
