/**
 * rules.route — Rulebook HTTP routes.
 * Why: GET /rules; POST/PATCH/DELETE judgement only.
 */
import { Router } from "express";

import {
  createJudgementRuleHandler,
  deleteJudgementRuleHandler,
  listRulesHandler,
  updateJudgementRuleHandler,
} from "./rules.controller.js";

const rulesRouter = Router();

rulesRouter.get("/", listRulesHandler);
rulesRouter.post("/", createJudgementRuleHandler);
rulesRouter.patch("/:id", updateJudgementRuleHandler);
rulesRouter.delete("/:id", deleteJudgementRuleHandler);

export default rulesRouter;
