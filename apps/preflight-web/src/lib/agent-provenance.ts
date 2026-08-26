/**
 * agent-provenance — name the GitAgent behind a field and the skills it read.
 * Why: campaign brief and asset detail both report one agent run (doc 19 §G2).
 */

const SKILL_PATH_PATTERN = /^skills\/(.+)\/SKILL\.md$/;

export const AGENT_LABEL = {
  extractor: "GitAgent extractor",
  generator: "GitAgent generator",
} as const;

export type ProvenanceAgent = keyof typeof AGENT_LABEL;

export function skillNameFromPath(path: string): string {
  return SKILL_PATH_PATTERN.exec(path)?.[1] ?? path;
}

export function skillsReadCaption(skillsRead: string[]): string {
  if (skillsRead.length === 0) {
    return "no skill read";
  }
  return skillsRead.map(skillNameFromPath).join(" · ");
}

export function agentRunCaption(
  agent: ProvenanceAgent,
  skillsRead: string[],
): string {
  return `${AGENT_LABEL[agent]} · ${skillsReadCaption(skillsRead)}`;
}
