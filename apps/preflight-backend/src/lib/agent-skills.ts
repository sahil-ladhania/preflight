/**
 * agent-skills — yaml skill list, catalog suffix, optional body dump.
 * Why: happy path is read; PREFLIGHT_SKILL_DUMP=1 dumps bodies.
 */
import type { Channel } from "@preflight/schemas";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const GENERATOR_BASE_SKILLS = ["brand-voice", "sebi-copy-constraints"] as const;

const GENERATOR_CHANNEL_SKILL: Record<Channel, string> = {
  email: "channel-email",
  linkedin: "channel-linkedin",
  display: "channel-display",
  whatsapp: "channel-shortform",
  landing: "channel-shortform",
};

export function resolveGeneratorSkillNames(channel: Channel): string[] {
  return [...GENERATOR_BASE_SKILLS, GENERATOR_CHANNEL_SKILL[channel]];
}

export function skillFilePath(name: string): string {
  return `skills/${name}/SKILL.md`;
}

export function extractReadPath(message: unknown): string | null {
  if (typeof message !== "object" || message === null) {
    return null;
  }

  const record = message as Record<string, unknown>;
  if (record.type !== "tool_use") {
    return null;
  }

  const toolName = record.name ?? record.toolName;
  if (toolName !== "read" && toolName !== undefined) {
    return null;
  }

  const input = record.input ?? record.args ?? record.arguments;
  if (typeof input !== "object" || input === null) {
    return null;
  }

  const path = (input as { path?: unknown }).path;
  return typeof path === "string" && path.trim().length > 0 ? path.trim() : null;
}

export function buildSkillCatalogSuffix(
  inScope: string[],
  optional: string[] = [],
): string {
  if (inScope.length === 0 && optional.length === 0) {
    return "";
  }

  const lines: string[] = [
    "## Skills (load via read — bodies are not inlined)",
    "Call read with the relative path before using a skill.",
  ];

  if (inScope.length > 0) {
    lines.push("", "In-scope (must read before answering):");
    for (const name of inScope) {
      lines.push(`- ${name} → ${skillFilePath(name)}`);
    }
  }

  if (optional.length > 0) {
    lines.push("", "Optional (read if relevant):");
    for (const name of optional) {
      lines.push(`- ${name} → ${skillFilePath(name)}`);
    }
  }

  return lines.join("\n");
}

export async function buildAgentSkillSuffix(
  agentDir: string,
  skillNames: string[] | undefined,
  dump: boolean,
): Promise<string> {
  const yamlNames = await readAgentSkillNames(agentDir);
  const inScope = skillNames ?? yamlNames;
  const inScopeSet = new Set(inScope);
  const optional = yamlNames.filter((name) => !inScopeSet.has(name));

  if (dump) {
    const dumpNames = skillNames !== undefined ? inScope : yamlNames;
    return loadSkillBodiesForSuffix(agentDir, dumpNames, { binding: true });
  }

  return buildSkillCatalogSuffix(inScope, optional);
}

function parseYamlSkillNames(manifestRaw: string): string[] {
  const lines = manifestRaw.split("\n");
  const skillsIndex = lines.findIndex((line) => line.trim() === "skills:");

  if (skillsIndex === -1) {
    return [];
  }

  const names: string[] = [];

  for (let index = skillsIndex + 1; index < lines.length; index += 1) {
    const line = lines[index] ?? "";

    if (/^\S/.test(line) && line.trim().length > 0) {
      break;
    }

    const match = line.match(/^\s*-\s+([a-z0-9-]+)\s*$/i);
    if (match?.[1]) {
      names.push(match[1]);
    }
  }

  return names;
}

export async function readAgentSkillNames(agentDir: string): Promise<string[]> {
  const manifestRaw = await readFile(join(agentDir, "agent.yaml"), "utf8");
  return parseYamlSkillNames(manifestRaw);
}

export interface LoadSkillSuffixOptions {
  binding?: boolean;
}

export async function loadSkillBodiesForSuffix(
  agentDir: string,
  skillNames: string[],
  options: LoadSkillSuffixOptions = {},
): Promise<string> {
  if (skillNames.length === 0) {
    return "";
  }

  const header = options.binding
    ? "## Binding skills for this call"
    : "## Available skills (also loadable via read tool)";
  const sections: string[] = [header];

  for (const name of skillNames) {
    const skillPath = join(agentDir, "skills", name, "SKILL.md");

    try {
      const body = await readFile(skillPath, "utf8");
      sections.push(`### Skill: ${name}\n${body.trim()}`);
    } catch {
      sections.push(`### Skill: ${name}\n(missing SKILL.md)`);
    }
  }

  return sections.join("\n\n");
}

export async function buildSkillPromptSuffix(agentDir: string): Promise<string> {
  const skillNames = await readAgentSkillNames(agentDir);
  return loadSkillBodiesForSuffix(agentDir, skillNames);
}
