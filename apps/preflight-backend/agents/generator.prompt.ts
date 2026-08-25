/**
 * generator.prompt — per-call generator prompt builder.
 * Why: brief + frozen snapshot wordings + det hints + optional regen revision.
 */
import type { BrandKitDTO, Channel, RuleKind, StructuredBriefInput } from "@preflight/schemas";

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
  brandKit: BrandKitDTO;
  rules: Array<{ ruleId: string; kind: RuleKind; wording: string }>;
  detHintLines: string[];
  revisionContext?: RegenRevisionInput;
}

const BINDING_SKILLS_INSTRUCTION =
  "Your system prompt includes brand-voice, sebi-copy-constraints, and the active channel skill. Treat them as binding layout and voice rules. The read tool may refresh skill text; do not skip them.";

function buildChannelConstraintsSection(
  channel: Channel,
  brandKit: BrandKitDTO,
): string[] {
  const hint = brandKit.channelHints[channel];
  if (!hint) {
    throw new Error(`Missing channel hint for ${channel}.`);
  }

  return [
    "Channel constraints (hard caps — must not exceed):",
    `- maxHeadlineChars: ${hint.maxHeadlineChars}`,
    `- layoutNotes: ${hint.layoutNotes}`,
  ];
}

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
    ...buildChannelConstraintsSection(input.channel, input.brandKit),
    "",
    "Brand kit (client visual + verbal lock):",
    JSON.stringify(input.brandKit, null, 2),
    "",
    `Required disclaimer (use verbatim in disclaimer field): ${input.brandKit.requiredDisclaimer}`,
    "",
    BINDING_SKILLS_INSTRUCTION,
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
    "Output JSON only: headline, body, disclaimer, cta. Disclaimer must include the required disclaimer verbatim unless a frozen rule requires additional text.",
  );

  return sections.join("\n");
}
