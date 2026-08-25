/**
 * error — central error handler.
 * Why: maps throws to ApiResponse envelope + status codes.
 */
import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../lib/http-error.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  void _next;

  if (process.env.NODE_ENV !== "production" && err instanceof Error) {
    console.error(err.stack);
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
}
