/**
 * agent-skills — parse yaml skill list and load SKILL.md bodies.
 * Why: doc 19 §7 fallback suffix when model skips read tool.
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
