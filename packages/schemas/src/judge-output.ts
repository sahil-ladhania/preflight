/**
 * judge-output — machine reading for one judgement rule.
 * Why: untrusted GitAgent JSON parse (documentation/12 Area 7).
 */

import { z } from "zod"
import { MachineVerdictSchema } from "./enums.js"

export const JudgeOutputSchema = z
  .object({
    verdict: MachineVerdictSchema,
    reason: z.string().trim().min(1),
    spanText: z.string().trim().min(1).optional(),
  })
  .strict()
export type JudgeOutput = z.infer<typeof JudgeOutputSchema>
