/**
 * extractor.prompt — per-call extractor prompt builder.
 * Why: free-text → partial StructuredBrief proposal.
 */

export interface ExtractorPromptInput {
  freeText: string;
}

export function buildExtractorPrompt(input: ExtractorPromptInput): string {
  return [
    "Parse the marketing brief below into structured fields.",
    "",
    "Allowed keys (include only keys you can infer):",
    "objective, schemeName, schemeCategory, audience, channels, market, performanceFigures, claims",
    "",
    "channels must use: email, linkedin, display, whatsapp, landing",
    "performanceFigures: [{\"value\":\"...\",\"period\":\"...\"}]",
    "Do not use audience value \"everyone\".",
    "",
    'Respond with JSON only — partial object with at least one key. No ruleIds.',
    "",
    "Free-text brief:",
    input.freeText,
  ].join("\n");
}
