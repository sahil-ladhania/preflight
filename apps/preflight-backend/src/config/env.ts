/**
 * env — sole Zod parse of process.env for backend.
 * Why: no raw process.env elsewhere (backend.mdc).
 */
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  DEMO_OPERATOR_NAME: z.string().min(1),
});

export const env = envSchema.parse(process.env);
