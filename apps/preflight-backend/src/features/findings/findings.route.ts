/**
 * findings.route — Finding action routes.
 * Why: POST waive, decide, retry.
 */
import { Router } from "express";

import {
  decideFindingHandler,
  retryFindingHandler,
  waiveFindingHandler,
} from "./findings.controller.js";

const findingsRouter = Router();

findingsRouter.post("/:id/waive", waiveFindingHandler);
findingsRouter.post("/:id/decide", decideFindingHandler);
findingsRouter.post("/:id/retry", retryFindingHandler);

export default findingsRouter;
