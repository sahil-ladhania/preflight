/**
 * assets.controller — Assets HTTP handlers.
 * Why: try/catch → ApiResponse envelope.
 */
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { getAssetDetail, listAssets } from "./assets.service.js";
import { buildRerunStrip } from "./rerun.service.js";
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

export async function listAssetsHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await listAssets();
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}

export async function getAssetDetailHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await getAssetDetail(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}

export async function rerunAssetHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await buildRerunStrip(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}
