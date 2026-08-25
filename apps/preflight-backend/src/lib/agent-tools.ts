/**
 * agent-tools — sandboxed read for GitAgent skill files.
 * Why: doc 19 §7.4; read only under agent dir skills/ and SOUL/RULES.
 */
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import type { GCToolDefinition } from "@open-gitagent/gitagent";

const ALLOWED_ROOT_FILES = new Set(["SOUL.md", "RULES.md"]);

export function isAllowedReadPath(agentDir: string, relativePath: string): boolean {
  const normalized = relativePath.replaceAll("\\", "/").replace(/^\/+/, "");

  if (normalized.includes("..")) {
    return false;
  }

  if (ALLOWED_ROOT_FILES.has(normalized)) {
    return true;
  }

  if (!normalized.startsWith("skills/")) {
    return false;
  }

  const absolute = resolve(agentDir, normalized);
  const resolvedAgentDir = resolve(agentDir);

  return absolute.startsWith(resolvedAgentDir);
}

export async function readSandboxedFile(
  agentDir: string,
  relativePath: string,
): Promise<string> {
  if (!isAllowedReadPath(agentDir, relativePath)) {
    throw new Error("Read path not allowed.");
  }

  return readFile(join(agentDir, relativePath), "utf8");
}

export function createReadTool(agentDir: string): GCToolDefinition {
  return {
    name: "read",
    description:
      "Read a file under this agent directory (skills/*.md, SOUL.md, RULES.md).",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Relative path e.g. skills/brand-voice/SKILL.md",
        },
      },
      required: ["path"],
    },
    handler: async (args: { path?: string }): Promise<string> => {
      if (typeof args.path !== "string" || args.path.trim().length === 0) {
        throw new Error("path is required.");
      }

      return readSandboxedFile(agentDir, args.path.trim());
    },
  };
}
