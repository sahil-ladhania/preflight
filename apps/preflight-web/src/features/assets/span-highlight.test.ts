/**
 * span-highlight.test — buildCopySegments cases from 15 §5.6.
 * Why: span paint gates the assets ledger demo.
 */

import { describe, expect, it } from "vitest";

import type { AssetDetailDTO, FieldOffsets, FindingDTO } from "@preflight/schemas";

import {
  SpanHighlightError,
  buildCopySegments,
} from "@/features/assets/span-highlight";
import { ASSET_KIT_FIELDS } from "@/fixtures/assets-detail/shared";

const HASH = "a".repeat(64);

function failFinding(
  id: string,
  spans: FindingDTO["spans"],
  overrides: Partial<FindingDTO> = {},
): FindingDTO {
  return {
    id,
    ruleId: "SEBI-06",
    kind: "judgement",
    frozenWording: "Performance claims must not imply guaranteed returns.",
    evaluationStatus: "complete",
    machineVerdict: "fail",
    machineReason: "Fail",
    spans,
    machineAt: "2026-03-15T11:05:00.000Z",
    humanVerdict: null,
    humanReason: null,
    humanActor: null,
    humanAt: null,
    judgeRun: null,
    ...overrides,
  };
}

function buildOffsets(
  canonicalText: string,
  headlineEnd: number,
  bodyEnd: number,
  disclaimerEnd: number,
): FieldOffsets {
  return {
    headline: { start: 0, end: headlineEnd },
    body: { start: headlineEnd, end: bodyEnd },
    disclaimer: { start: bodyEnd, end: disclaimerEnd },
    cta: { start: disclaimerEnd, end: canonicalText.length },
  };
}

function baseAsset(overrides: Partial<AssetDetailDTO>): AssetDetailDTO {
  const headline = "Headline text";
  const body = "Body prefix FAIL suffix";
  const disclaimer = "Disclaimer line";
  const cta = "Go";
  const canonicalText = headline + body + disclaimer + cta;

  return {
    id: "asset-1",
    campaignId: "campaign-1",
    channel: "display",
    constraintSetId: "cs-1",
    headline,
    body,
    disclaimer,
    cta,
    canonicalText,
    fieldOffsets: buildOffsets(
      canonicalText,
      headline.length,
      headline.length + body.length,
      headline.length + body.length + disclaimer.length,
    ),
    runHash: HASH,
    rulesetHash: HASH,
    ...ASSET_KIT_FIELDS,
    generatedAt: "2026-03-15T11:00:00.000Z",
    regeneratedFromId: null,
    generationIndex: 1,
    status: "needs_human",
    findings: [],
    exceptions: [],
    lineage: null,
    ...overrides,
  };
}

function bodySpan(text: string, asset: AssetDetailDTO): FindingDTO["spans"] {
  const bodyStart = asset.fieldOffsets.body.start;
  const index = asset.body.indexOf(text);
  if (index < 0) {
    throw new Error(`Missing body substring: ${text}`);
  }
  const start = bodyStart + index;
  return [{ start, end: start + text.length, text }];
}

describe("buildCopySegments", () => {
  it("no spans — all segments unmarked", () => {
    const asset = baseAsset({
      findings: [
        {
          ...failFinding("f-pass", []),
          evaluationStatus: "complete",
          machineVerdict: "pass",
        },
      ],
    });

    const segments = buildCopySegments(asset);

    expect(segments.headline).toEqual([{ text: "Headline text", findingId: null }]);
    expect(segments.body).toEqual([
      { text: "Body prefix FAIL suffix", findingId: null },
    ]);
    expect(segments.disclaimer).toEqual([{ text: "Disclaimer line", findingId: null }]);
    expect(segments.cta).toEqual([{ text: "Go", findingId: null }]);
  });

  it("single fail mid-body", () => {
    const asset = baseAsset({});
    const findingId = "f-fail-1";

    const segments = buildCopySegments({
      ...asset,
      findings: [failFinding(findingId, bodySpan("FAIL", asset))],
    });

    expect(segments.body).toEqual([
      { text: "Body prefix ", findingId: null },
      { text: "FAIL", findingId },
      { text: " suffix", findingId: null },
    ]);
  });

  it("span at field edge", () => {
    const asset = baseAsset({});
    const findingId = "f-edge";
    const bodyStart = asset.fieldOffsets.body.start;

    const segments = buildCopySegments({
      ...asset,
      findings: [
        failFinding(findingId, [
          {
            start: bodyStart,
            end: bodyStart + "Body prefix".length,
            text: "Body prefix",
          },
        ]),
      ],
    });

    expect(segments.body[0]).toEqual({ text: "Body prefix", findingId });
    expect(segments.body[1]).toEqual({ text: " FAIL suffix", findingId: null });
  });

  it("two fails in one field", () => {
    const asset = baseAsset({});
    const failA = "f-a";
    const failB = "f-b";

    const segments = buildCopySegments({
      ...asset,
      findings: [
        failFinding(failA, bodySpan("FAIL", asset)),
        failFinding(failB, bodySpan("suffix", asset)),
      ],
    });

    expect(segments.body).toEqual([
      { text: "Body prefix ", findingId: null },
      { text: "FAIL", findingId: failA },
      { text: " ", findingId: null },
      { text: "suffix", findingId: failB },
    ]);
  });

  it("waived fail still paints", () => {
    const asset = baseAsset({});
    const findingId = "f-waived";

    const segments = buildCopySegments({
      ...asset,
      findings: [
        failFinding(findingId, bodySpan("FAIL", asset), {
          humanVerdict: "waived",
          humanReason: "Demo exception",
          humanActor: "Demo Operator",
          humanAt: "2026-03-15T12:00:00.000Z",
        }),
      ],
    });

    expect(segments.body[1]).toEqual({ text: "FAIL", findingId });
  });

  it("span spanning whole field", () => {
    const asset = baseAsset({});
    const findingId = "f-whole";
    const { start, end } = asset.fieldOffsets.body;

    const segments = buildCopySegments({
      ...asset,
      findings: [
        failFinding(findingId, [
          {
            start,
            end,
            text: asset.body,
          },
        ]),
      ],
    });

    expect(segments.body).toEqual([
      { text: "Body prefix FAIL suffix", findingId },
    ]);
  });

  it("overlapping spans from two findings", () => {
    const asset = baseAsset({});
    const failA = "f-overlap-a";
    const failB = "f-overlap-b";
    const bodyStart = asset.fieldOffsets.body.start;
    const failIndex = asset.body.indexOf("FAIL");

    const segments = buildCopySegments({
      ...asset,
      findings: [
        failFinding(failA, [
          {
            start: bodyStart + failIndex,
            end: bodyStart + failIndex + "FAIL su".length,
            text: "FAIL su",
          },
        ]),
        failFinding(failB, bodySpan("suffix", asset)),
      ],
    });

    expect(segments.body).toEqual([
      { text: "Body prefix ", findingId: null },
      { text: "FAIL su", findingId: failA },
      { text: "ffix", findingId: failB },
    ]);
  });

  it("empty field text", () => {
    const asset = baseAsset({
      fieldOffsets: {
        headline: { start: 10, end: 10 },
        body: { start: 13, end: 36 },
        disclaimer: { start: 36, end: 36 },
        cta: { start: 36, end: 38 },
      },
    });

    const segments = buildCopySegments(asset);

    expect(segments.headline).toEqual([{ text: "", findingId: null }]);
    expect(segments.disclaimer).toEqual([{ text: "", findingId: null }]);
  });

  it("cross-field span paints only clamped portion", () => {
    const headline = "Head";
    const body = "line rest";
    const canonicalText = headline + body;
    const asset = baseAsset({
      headline,
      body,
      disclaimer: "",
      cta: "",
      canonicalText,
      fieldOffsets: buildOffsets(canonicalText, headline.length, canonicalText.length, canonicalText.length),
      findings: [
        failFinding("f-cross", [{ start: 3, end: 9, text: "d line" }]),
      ],
    });

    const segments = buildCopySegments(asset);

    expect(segments.headline).toEqual([
      { text: "Hea", findingId: null },
      { text: "d", findingId: "f-cross" },
    ]);
    expect(segments.body[0]).toEqual({ text: "line ", findingId: "f-cross" });
    expect(segments.body[1]).toEqual({ text: "rest", findingId: null });
  });

  it("throws when span text does not match canonical slice", () => {
    const asset = baseAsset({});

    expect(() =>
      buildCopySegments({
        ...asset,
        findings: [failFinding("f-bad", bodySpan("FAIL", asset).map((span) => ({
          ...span,
          text: "WRONG",
        })))],
      }),
    ).toThrow(SpanHighlightError);
  });
});
