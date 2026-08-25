/**
 * assets.route — Assets HTTP routes.
 * Why: GET /assets, GET /assets/:id, POST /assets/:id/rerun.
 */
import { Router } from "express";

import {
  getAssetDetailHandler,
  listAssetsHandler,
  rerunAssetHandler,
} from "./assets.controller.js";

const assetsRouter = Router();

assetsRouter.get("/", listAssetsHandler);
assetsRouter.get("/:id", getAssetDetailHandler);
assetsRouter.post("/:id/rerun", rerunAssetHandler);

export default assetsRouter;
