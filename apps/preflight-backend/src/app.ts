/**
 * app — express app shell (middleware only).
 * Why: routes mount here in later phases.
 */
import cors from "cors";
import express, { type Express } from "express";

import { errorHandler } from "./middleware/error.js";

export function createApp(): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ success: true, data: { ok: true } });
  });

  app.use(errorHandler);

  return app;
}
