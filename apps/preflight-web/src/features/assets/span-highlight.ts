/**
 * span-highlight — fieldOffsets + spans → paint segments.
 * Why: only real client logic module for assets detail.
 */

import type { AssetDetailDTO, FindingDTO } from "@preflight/schemas";

import type { CopySegments, SpanSegment } from "@/features/assets/types";

const FIELD_KEYS = ["headline", "body", "disclaimer", "cta"] as const satisfies ReadonlyArray<
  keyof CopySegments
>;

export class SpanHighlightError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpanHighlightError";
  }
}

interface ClampedSpan {
  start: number;
  end: number;
  findingId: string;
  text: string;
}

function isPaintableFail(finding: FindingDTO): boolean {
  return (
    finding.evaluationStatus === "complete" && finding.machineVerdict === "fail"
  );
}

function clampSpan(
  span: FindingDTO["spans"][number],
  fieldStart: number,
  fieldEnd: number,
): { start: number; end: number } | null {
  const start = Math.max(span.start, fieldStart);
  const end = Math.min(span.end, fieldEnd);
  if (end <= start) {
    return null;
  }
  return { start, end };
}

function collectClampedSpans(
  findings: FindingDTO[],
  fieldStart: number,
  fieldEnd: number,
  canonicalText: string,
): ClampedSpan[] {
  const clamped: ClampedSpan[] = [];

  for (const finding of findings) {
    if (!isPaintableFail(finding)) {
      continue;
    }

    for (const span of finding.spans) {
      const range = clampSpan(span, fieldStart, fieldEnd);
      if (range === null) {
        continue;
      }

      const sliceText = canonicalText.slice(range.start, range.end);
      const isFullyContained =
        span.start >= fieldStart && span.end <= fieldEnd;

      if (isFullyContained && sliceText !== span.text) {
        throw new SpanHighlightError(
          `Span text mismatch for finding ${finding.id} at [${span.start},${span.end}): expected ${JSON.stringify(span.text)}, got ${JSON.stringify(sliceText)}`,
        );
      }

      clamped.push({
        start: range.start,
        end: range.end,
        findingId: finding.id,
        text: sliceText,
      });
    }
  }

  return clamped;
}

function findingForSegment(
  segmentStart: number,
  segmentEnd: number,
  spans: ClampedSpan[],
): string | null {
  const overlapping = spans.filter(
    (span) => segmentStart < span.end && segmentEnd > span.start,
  );

  if (overlapping.length === 0) {
    return null;
  }

  overlapping.sort((left, right) => {
    if (left.start !== right.start) {
      return left.start - right.start;
    }
    return left.findingId.localeCompare(right.findingId);
  });

  return overlapping[0]?.findingId ?? null;
}

function buildFieldSegments(
  canonicalText: string,
  fieldStart: number,
  fieldEnd: number,
  findings: FindingDTO[],
): SpanSegment[] {
  if (fieldStart >= fieldEnd) {
    return [{ text: "", findingId: null }];
  }

  const fieldText = canonicalText.slice(fieldStart, fieldEnd);
  if (fieldText.length === 0) {
    return [{ text: "", findingId: null }];
  }

  const clampedSpans = collectClampedSpans(
    findings,
    fieldStart,
    fieldEnd,
    canonicalText,
  );

  const boundaries = new Set<number>([fieldStart, fieldEnd]);
  for (const span of clampedSpans) {
    boundaries.add(span.start);
    boundaries.add(span.end);
  }

  const points = [...boundaries].sort((left, right) => left - right);
  const segments: SpanSegment[] = [];

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    if (start === undefined || end === undefined || end <= start) {
      continue;
    }

    const text = canonicalText.slice(start, end);
    const findingId = findingForSegment(start, end, clampedSpans);
    const previous = segments[segments.length - 1];

    if (previous !== undefined && previous.findingId === findingId) {
      previous.text += text;
      continue;
    }

    segments.push({ text, findingId });
  }

  if (segments.length === 0) {
    return [{ text: fieldText, findingId: null }];
  }

  return segments;
}

export function buildCopySegments(asset: AssetDetailDTO): CopySegments {
  const segments = {} as CopySegments;

  for (const field of FIELD_KEYS) {
    const range = asset.fieldOffsets[field];
    segments[field] = buildFieldSegments(
      asset.canonicalText,
      range.start,
      range.end,
      asset.findings,
    );
  }

  return segments;
}
