/**
 * agent-dir — read OpenGAP def files for gitagent gateway.
 * Why: model/maxTurns from agent.yaml; SOUL+RULES system prompt without loader junk.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface AgentRuntimeConfig {
  modelPreferred: string;
  maxTurns: number;
}

async function readFileOrEmpty(path: string): Promise<string> {
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

function matchYamlScalar(raw: string, key: string): string | null {
  const pattern = new RegExp(`^\\s*${key}:\\s*"?([^"\\n]+)"?`, "m");
  const match = raw.match(pattern);
  return match?.[1]?.trim() ?? null;
}

export async function readAgentRuntimeConfig(
  agentDir: string,
): Promise<AgentRuntimeConfig> {
  const manifestRaw = await readFileOrEmpty(join(agentDir, "agent.yaml"));
  const modelPreferred = matchYamlScalar(manifestRaw, "preferred");
  const maxTurnsRaw = matchYamlScalar(manifestRaw, "max_turns");

  if (modelPreferred === null) {
    throw new Error(`agent.yaml missing model.preferred in ${agentDir}`);
  }

  const maxTurns =
    maxTurnsRaw !== null ? Number.parseInt(maxTurnsRaw, 10) : 1;

  if (!Number.isFinite(maxTurns) || maxTurns < 1) {
    throw new Error(`agent.yaml invalid runtime.max_turns in ${agentDir}`);
  }

  return { modelPreferred, maxTurns };
}

export async function buildAgentSystemPrompt(agentDir: string): Promise<string> {
  const [manifestRaw, soul, rules] = await Promise.all([
    readFileOrEmpty(join(agentDir, "agent.yaml")),
    readFileOrEmpty(join(agentDir, "SOUL.md")),
    readFileOrEmpty(join(agentDir, "RULES.md")),
  ]);

  const parts: string[] = [];
  const name = matchYamlScalar(manifestRaw, "name");
  const version = matchYamlScalar(manifestRaw, "version");
  const description = matchYamlScalar(manifestRaw, "description");

  if (name !== null && version !== null && description !== null) {
    parts.push(`# ${name} v${version}\n${description}`);
  }

  if (soul.trim().length > 0) {
    parts.push(soul.trim());
  }

  if (rules.trim().length > 0) {
    parts.push(rules.trim());
  }

  return parts.join("\n\n");
}
