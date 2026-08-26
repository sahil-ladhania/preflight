/**
 * finding-decision — FindingDecisionDTO for human audit trail.
 * Why: G-02 governance; append-only decision history (doc 21).
 */

import { z } from "zod";

import { HumanVerdictSchema } from "./enums.js";
import { IsoDateTimeSchema } from "./primitives.js";

export const DecisionActionSchema = z.enum([
  "waive",
  "confirm",
  "override",
  "retry",
]);
export type DecisionAction = z.infer<typeof DecisionActionSchema>;

export const FindingDecisionDTOSchema = z.object({
  id: z.string().min(1),
  action: DecisionActionSchema,
  previousVerdict: HumanVerdictSchema.nullable(),
  verdict: HumanVerdictSchema.nullable(),
  reason: z.string().nullable(),
  actor: z.string().min(1),
  at: IsoDateTimeSchema,
});
export type FindingDecisionDTO = z.infer<typeof FindingDecisionDTOSchema>;
