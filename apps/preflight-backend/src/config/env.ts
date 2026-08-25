/**
 * env — sole Zod parse of process.env for backend.
 * Why: no raw process.env elsewhere (backend.mdc).
 */
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1).optional(),
  DEMO_OPERATOR_NAME: z.string().min(1),
});

export const env = envSchema.parse(process.env);
