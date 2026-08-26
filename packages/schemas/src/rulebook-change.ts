/**
 * rulebook-change — RulebookChangeSummaryDTO for live catalog audit.
 * Why: G-04 governance on Rulebook writes (doc 21).
 */

import { z } from "zod";

import { IsoDateTimeSchema } from "./primitives.js";

export const RulebookChangeActionSchema = z.enum(["create", "update", "delete"]);
export type RulebookChangeAction = z.infer<typeof RulebookChangeActionSchema>;

export const RulebookChangeSummaryDTOSchema = z.object({
  action: RulebookChangeActionSchema,
  actor: z.string().min(1),
  reason: z.string().min(1),
  at: IsoDateTimeSchema,
});
export type RulebookChangeSummaryDTO = z.infer<
  typeof RulebookChangeSummaryDTOSchema
>;

export const ChangeReasonSchema = z.string().trim().min(10);
export type ChangeReason = z.infer<typeof ChangeReasonSchema>;
