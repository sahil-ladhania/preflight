/**
 * injection — InjectionDetection wire shape for extract responses.
 * Why: G-05 Campaign banner on high severity (doc 21).
 */

import { z } from "zod";

export const InjectionSeveritySchema = z.enum(["low", "medium", "high"]);
export type InjectionSeverity = z.infer<typeof InjectionSeveritySchema>;

export const InjectionDetectionSchema = z.object({
  signals: z.array(z.string().min(1)),
  severity: InjectionSeveritySchema,
});
export type InjectionDetection = z.infer<typeof InjectionDetectionSchema>;
