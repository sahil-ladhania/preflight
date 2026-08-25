/**
 * spike-gitagent — throwaway GitAgent call-path check (13-agent-architecture.md §9).
 */
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { JudgeOutputSchema } from "@preflight/schemas";

dotenv.config({
  path: path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../.env",
  ),
});

const { runAgent } = await import("../src/lib/gitagent.js");

function stripJsonFence(content: string): string {
  const trimmed = content.trim();
  const match = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  return match?.[1]?.trim() ?? trimmed;
}

async function main(): Promise<void> {
  const prompt =
    'Return JSON only: {"verdict":"pass","reason":"spike ok"} — no other text.';

  const { content } = await runAgent("judge", prompt);
  console.log("assistant.content:", content);

  const parsed = JudgeOutputSchema.parse(JSON.parse(stripJsonFence(content)));
  console.log("parsed verdict:", parsed.verdict);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("spike failed:", message);
  process.exit(1);
});
