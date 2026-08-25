/**
 * campaigns.controller — Campaign HTTP handlers.
 * Why: try/catch → ApiResponse envelope (14-backend-design.md Area 2).
 */
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import {
  CompileRequestSchema,
  CreateCampaignRequestSchema,
  ExtractRequestSchema,
  GenerateRequestSchema,
  PutBriefRequestSchema,
} from "@preflight/schemas";

import {
  compileCampaign,
  createCampaign,
  extractBrief,
  generateAssets,
  getCampaignById,
  getLatestCampaign,
  updateBrief,
} from "./campaigns.service.js";
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

export async function createCampaignHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = CreateCampaignRequestSchema.parse(req.body ?? {});
    const data = await createCampaign(body.freeText);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}

export async function getLatestCampaignHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await getLatestCampaign();
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}

export async function getCampaignByIdHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await getCampaignById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}

export async function updateBriefHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = PutBriefRequestSchema.parse(req.body);
    const data = await updateBrief(req.params.id, body.structuredBrief);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}

export async function compileCampaignHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    CompileRequestSchema.parse(req.body ?? {});
    const data = await compileCampaign(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}

export async function extractBriefHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = ExtractRequestSchema.parse(req.body);
    const data = await extractBrief(req.params.id, body.freeText);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}

export async function generateAssetsHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = GenerateRequestSchema.parse(req.body ?? {});
    const data = await generateAssets(req.params.id, body.regeneratedFromId);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}
