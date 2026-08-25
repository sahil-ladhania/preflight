/**
 * generator.prompt — per-call generator prompt builder.
 * Why: brief + frozen snapshot wordings + det hints + optional regen revision.
 */
import type { Channel, RuleKind, StructuredBriefInput } from "@preflight/schemas";

export interface RegenFailureInput {
  ruleId: string;
  kind: RuleKind;
  machineReason: string;
  spanText: string | null;
}

export interface RegenRevisionInput {
  priorCanonicalText: string;
  failures: RegenFailureInput[];
}

export interface GeneratorPromptInput {
  channel: Channel;
  brief: StructuredBriefInput;
  rules: Array<{ ruleId: string; kind: RuleKind; wording: string }>;
  detHintLines: string[];
  revisionContext?: RegenRevisionInput;
}

const CHANNEL_TONE: Record<Channel, string> = {
  email: "Professional, informative email — no hype or urgency tricks.",
  linkedin: "Professional LinkedIn tone — credible, not salesy.",
  display: "Short display copy — clear headline, restrained claims.",
  whatsapp: "Short, formal WhatsApp message — plain language.",
  landing: "Landing page copy — informative hero, compliant subtext.",
};

function buildRevisionSection(revision: RegenRevisionInput): string[] {
  const failureLines =
    revision.failures.length === 0
      ? ["- (none recorded — still improve compliance vs prior draft)"]
      : revision.failures.map((failure) => {
          const span = failure.spanText ? ` Offending span: "${failure.spanText}"` : "";
          return `- [${failure.kind}] ${failure.ruleId}: ${failure.machineReason}.${span}`;
        });

  return [
    "Revision context (revise the prior draft; fix listed failures without new violations):",
    "",
    "Prior draft:",
    revision.priorCanonicalText,
    "",
    "Failed rules on prior draft:",
    ...failureLines,
  ];
}

export function buildGeneratorPrompt(input: GeneratorPromptInput): string {
  const ruleLines = input.rules.map(
    (rule) => `- [${rule.kind}] ${rule.ruleId}: ${rule.wording}`,
  );

  const sections = [
    `Write marketing copy for channel: ${input.channel}`,
    "",
    `Channel tone: ${CHANNEL_TONE[input.channel]}`,
    "",
    "Structured brief:",
    JSON.stringify(input.brief, null, 2),
    "",
    "Compliance rules (respect these wordings):",
    ...ruleLines,
  ];

  if (input.detHintLines.length > 0) {
    sections.push(
      "",
      "Deterministic implementation (must satisfy exactly):",
      ...input.detHintLines.map((line) => `- ${line}`),
    );
  }

  if (input.revisionContext) {
    sections.push("", ...buildRevisionSection(input.revisionContext));
  }

  sections.push(
    "",
    "Output JSON only: headline, body, disclaimer, cta. Keep performance claims and substantiation in body; disclaimer holds the standard risk phrase.",
  );

  return sections.join("\n");
}
