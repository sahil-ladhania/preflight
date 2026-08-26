/**
 * generate-prepare — one channel: agent → disclaimer patch → det run.
 * Why: extracted from generate.service to stay under file limit.
 */
import { hashRun, runDeterministic, type DetRunRule } from "@preflight/rules";
import type { Channel, GeneratorOutput, RuleKind, StructuredBriefInput } from "@preflight/schemas";

import type { RegenRevisionInput } from "../../../agents/generator.prompt.js";
import type { AgentRunMeta } from "../../lib/gitagent.js";
import { InternalError } from "../../lib/http-error.js";
import { callGenerator } from "./generate-agent.js";
import { buildCanonicalText } from "./generate-canonical.js";
import { ensureSebi01Disclaimer } from "./generate-disclaimer.js";
import { recordAgentRun } from "../agent-runs/agent-runs.service.js";

export interface PreparedChannel {
  channel: Channel;
  output: GeneratorOutput;
  skillsRead: string[];
  meta: AgentRunMeta;
  generatorRunId: string | null;
  canonicalText: string;
  fieldOffsets: ReturnType<typeof buildCanonicalText>["fieldOffsets"];
  runHash: string;
  detFindings: ReturnType<typeof runDeterministic>["findings"];
}

function runDeterministicSafe(
  canonicalText: string,
  rules: DetRunRule[],
): ReturnType<typeof runDeterministic> {
  try {
    return runDeterministic({ canonicalText, rules });
  } catch {
    throw new InternalError("Deterministic engine error.");
  }
}

export async function prepareChannelForGenerate(input: {
  channel: Channel;
  structuredBrief: StructuredBriefInput;
  ruleWordings: Array<{ ruleId: string; kind: RuleKind; wording: string }>;
  pinnedDetRuleIds: string[];
  detRules: DetRunRule[];
  rulesetHash: string;
  sebi01Pinned: boolean;
  revisionContext?: RegenRevisionInput;
}): Promise<PreparedChannel> {
  const raw = await callGenerator({
    channel: input.channel,
    brief: input.structuredBrief,
    rules: input.ruleWordings,
    pinnedDetRuleIds: input.pinnedDetRuleIds,
    revisionContext: input.revisionContext,
  });
  const generatorRunId = await recordAgentRun(raw.meta, { kind: "asset", id: null });
  const output = ensureSebi01Disclaimer(raw.output, input.sebi01Pinned);
  const { canonicalText, fieldOffsets } = buildCanonicalText(output);
  const { findings } = runDeterministicSafe(canonicalText, input.detRules);
  const matcherOutputs = findings.map((finding) => ({
    ruleId: finding.ruleId,
    machineVerdict: finding.machineVerdict,
    spans: finding.spans,
  }));
  const runHash = hashRun({
    canonicalText,
    rulesetHash: input.rulesetHash,
    matcherOutputs,
  });

  return {
    channel: input.channel,
    output,
    skillsRead: raw.skillsRead,
    meta: raw.meta,
    generatorRunId,
    canonicalText,
    fieldOffsets,
    runHash,
    detFindings: findings,
  };
}
