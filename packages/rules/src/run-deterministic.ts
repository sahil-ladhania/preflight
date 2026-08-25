/**
 * run-deterministic — runDeterministic runner locked signature.
 * Why: frozen det snapshots in; findings and hashes out (documentation/12 Area 1).
 */
import type { DetFinding, MatcherOutput } from "./finding.js";
import type { DetRunRule } from "./hashes.js";
import { hashRun, hashRuleset } from "./hashes.js";

export interface RunDeterministicInput {
  canonicalText: string;
  rules: DetRunRule[];
}

export interface RunDeterministicOutput {
  findings: DetFinding[];
  runHash: string;
  rulesetHash: string;
}

export function runDeterministic(
  input: RunDeterministicInput,
): RunDeterministicOutput {
  const findings: DetFinding[] = [];
  const matcherOutputs: MatcherOutput[] = [];

  for (const rule of input.rules) {
    const result = rule.match(input.canonicalText);
    findings.push({
      ruleId: rule.id,
      kind: "deterministic",
      machineVerdict: result.machineVerdict,
      machineReason: result.machineReason,
      spans: result.spans,
    });
    matcherOutputs.push({
      ruleId: rule.id,
      machineVerdict: result.machineVerdict,
      spans: result.spans,
    });
  }

  const rulesetHash = hashRuleset(input.rules);
  const runHash = hashRun({
    canonicalText: input.canonicalText,
    rulesetHash,
    matcherOutputs,
  });

  return { findings, runHash, rulesetHash };
}
