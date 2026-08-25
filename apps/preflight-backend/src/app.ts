/**
 * app — express app shell (middleware only).
 * Why: routes mount here in later phases.
 */
import cors from "cors";
import express, { type Express } from "express";

import assetsRouter from "./features/assets/assets.route.js";
import findingsRouter from "./features/findings/findings.route.js";
import rulesRouter from "./features/rules/rules.route.js";
import { errorHandler } from "./middleware/error.js";

export function createApp(): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ success: true, data: { ok: true } });
  });

  app.use("/api/assets", assetsRouter);
  app.use("/api/findings", findingsRouter);
  app.use("/api/rules", rulesRouter);

  app.use(errorHandler);

  return app;
}
