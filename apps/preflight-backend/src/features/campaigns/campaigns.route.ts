/**
 * campaigns.route — Campaign HTTP routes.
 * Why: POST /campaigns, GET /campaigns/:id, PUT brief, POST compile/generate.
 */
import { Router } from "express";

import {
  compileCampaignHandler,
  createCampaignHandler,
  generateAssetsHandler,
  getCampaignByIdHandler,
  getLatestCampaignHandler,
  updateBriefHandler,
} from "./campaigns.controller.js";

const campaignsRouter = Router();

campaignsRouter.post("/", createCampaignHandler);
campaignsRouter.get("/latest", getLatestCampaignHandler);
campaignsRouter.get("/:id", getCampaignByIdHandler);
campaignsRouter.put("/:id/brief", updateBriefHandler);
campaignsRouter.post("/:id/compile", compileCampaignHandler);
campaignsRouter.post("/:id/generate", generateAssetsHandler);

export default campaignsRouter;
