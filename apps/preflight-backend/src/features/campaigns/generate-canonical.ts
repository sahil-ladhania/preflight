/**
 * generate-canonical — canonicalText + fieldOffsets from generator output.
 * Why: locked delimiter recipe (14-backend-design.md Area 3).
 */
import type { GeneratorOutput } from "@preflight/schemas";
import type { FieldOffsets } from "@preflight/schemas";

export const FIELD_DELIMITER = "\n\n";

function proofField(value: string): string {
  return value.length === 0 ? "\u200b" : value;
}

export function buildCanonicalText(fields: GeneratorOutput): {
  canonicalText: string;
  fieldOffsets: FieldOffsets;
} {
  const headline = proofField(fields.headline);
  const body = proofField(fields.body);
  const disclaimer = proofField(fields.disclaimer);
  const cta = proofField(fields.cta);

  const headlineEnd = headline.length;
  const bodyStart = headlineEnd + FIELD_DELIMITER.length;
  const bodyEnd = bodyStart + body.length;
  const disclaimerStart = bodyEnd + FIELD_DELIMITER.length;
  const disclaimerEnd = disclaimerStart + disclaimer.length;
  const ctaStart = disclaimerEnd + FIELD_DELIMITER.length;
  const ctaEnd = ctaStart + cta.length;

  return {
    canonicalText: [headline, body, disclaimer, cta].join(FIELD_DELIMITER),
    fieldOffsets: {
      headline: { start: 0, end: headlineEnd },
      body: { start: bodyStart, end: bodyEnd },
      disclaimer: { start: disclaimerStart, end: disclaimerEnd },
      cta: { start: ctaStart, end: ctaEnd },
    },
  };
}
