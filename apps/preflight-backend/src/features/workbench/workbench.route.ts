/**
 * workbench.route — Workbench HTTP route.
 * Why: POST /workbench/chat.
 */
import { Router } from "express";

import { chatHandler } from "./workbench.controller.js";

const workbenchRouter = Router();

workbenchRouter.post("/chat", chatHandler);

export default workbenchRouter;
