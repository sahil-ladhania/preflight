/**
 * agent-tool-policy — per-agent GitAgent tool policy.
 * Why: doc 19 §7.4 judge no tools; three agents get sandboxed read.
 */
import type { AgentName } from "./gitagent.js";

export interface AgentToolPolicy {
  allowReadTool: boolean;
  allowToolStream: boolean;
}

export function getAgentToolPolicy(name: AgentName): AgentToolPolicy {
  if (name === "judge") {
    return { allowReadTool: false, allowToolStream: false };
  }

  return { allowReadTool: true, allowToolStream: true };
}
