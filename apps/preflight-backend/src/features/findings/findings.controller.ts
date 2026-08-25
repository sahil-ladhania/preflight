/**
 * findings.controller — Finding mutation handlers.
 * Why: Zod on body; map errors to ApiResponse (14-backend-design.md Area 6).
 */
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import {
  DecideRequestSchema,
  RetryRequestSchema,
  WaiveRequestSchema,
} from "@preflight/schemas";

import {
  decideFinding,
  retryFinding,
  waiveFinding,
} from "./findings.service.js";
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

export async function waiveFindingHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = WaiveRequestSchema.parse(req.body);
    const data = await waiveFinding(req.params.id, body.reason);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}

export async function decideFindingHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = DecideRequestSchema.parse(req.body);
    const data = await decideFinding(req.params.id, body);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}

export async function retryFindingHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    RetryRequestSchema.parse(req.body);
    const data = await retryFinding(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}
