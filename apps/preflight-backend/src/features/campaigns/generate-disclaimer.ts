/**
 * generate-disclaimer — code safety net for SEBI-01 before det run.
 * Why: model often omits exact disclaimer phrase on regen.
 */
import { REQUIRED_DISCLAIMER_PHRASE } from "@preflight/rules";
import type { GeneratorOutput } from "@preflight/schemas";

function disclaimerHasRequiredPhrase(disclaimer: string): boolean {
  const collapsed = disclaimer.toLowerCase().replace(/\s+/g, " ");
  return collapsed.includes(REQUIRED_DISCLAIMER_PHRASE);
}

export function ensureSebi01Disclaimer(
  output: GeneratorOutput,
  sebi01Pinned: boolean,
): GeneratorOutput {
  if (!sebi01Pinned || disclaimerHasRequiredPhrase(output.disclaimer)) {
    return output;
  }

  const required = `${REQUIRED_DISCLAIMER_PHRASE.charAt(0).toUpperCase()}${REQUIRED_DISCLAIMER_PHRASE.slice(1)}.`;

  if (output.disclaimer.trim().length === 0) {
    return { ...output, disclaimer: required };
  }

  return {
    ...output,
    disclaimer: `${required} ${output.disclaimer.trim()}`,
  };
}
