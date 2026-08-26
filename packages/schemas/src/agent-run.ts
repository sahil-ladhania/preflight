/**
 * agent-run — AgentRunSummaryDTO for wire responses.
 * Why: G-01 governance trace on asset detail and finding rows (doc 21).
 */

import { z } from "zod";

import { IsoDateTimeSchema } from "./primitives.js";

export const AgentNameSchema = z.enum([
  "extractor",
  "generator",
  "judge",
  "explainer",
]);
export type AgentName = z.infer<typeof AgentNameSchema>;

export const AgentRunSummaryDTOSchema = z.object({
  id: z.string().min(1),
  agentName: AgentNameSchema,
  agentDefVersion: z.string().min(1),
  model: z.string().min(1),
  inputTokens: z.number().int().nonnegative().nullable(),
  outputTokens: z.number().int().nonnegative().nullable(),
  totalTokens: z.number().int().nonnegative().nullable(),
  costUsd: z.number().nonnegative().nullable(),
  latencyMs: z.number().int().nonnegative(),
  occurredAt: IsoDateTimeSchema,
  ok: z.boolean(),
  errorKind: z.string().nullable(),
});
export type AgentRunSummaryDTO = z.infer<typeof AgentRunSummaryDTOSchema>;
