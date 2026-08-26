/**
 * workbench.controller — Workbench HTTP handler.
 * Why: try/catch → ApiResponse envelope.
 */
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { WorkbenchChatRequestSchema } from "@preflight/schemas";

import { chat } from "./workbench.service.js";
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

export async function chatHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = WorkbenchChatRequestSchema.parse(req.body);
    const data = await chat(body.message, body.history, body.capturedBrief);
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res, next);
  }
}
