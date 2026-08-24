/**
 * app — express app shell (middleware only).
 * Why: routes mount here in later phases.
 */
import cors from "cors";
import express, { type Express } from "express";

export function createApp(): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());
  return app;
}
