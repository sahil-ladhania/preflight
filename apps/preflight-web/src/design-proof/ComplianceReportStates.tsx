/**
 * ComplianceReportStates — design-proof links for exhibit variants.
 */

import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import type { ComplianceReportDTO } from "@preflight/schemas";

import { ComplianceReport } from "@/features/assets/report/ComplianceReport";
import {
  ReportErrorState,
  ReportLoadingState,
  ReportNotFoundState,
} from "@/features/assets/report/ComplianceReportStates";
import { ASSET_B } from "@/fixtures/assets-detail/b";
import { FROZEN_WORDING } from "@/fixtures/assets-detail/shared";
import { ASSET_ID_B } from "@/fixtures/assets-list";

function buildReportFixture(): ComplianceReportDTO {
  const { copySegments: _copySegments, findings: baseFindings, ...assetBDetail } =
    ASSET_B;
  const headline = assetBDetail.headline;
  const body = assetBDetail.body;
  const disclaimer = assetBDetail.disclaimer;
  const cta = assetBDetail.cta;
  const canonicalText = [headline, body, disclaimer, cta].join("\n\n");

  let cursor = 0;
  const headlineRange = { start: cursor, end: cursor + headline.length };
  cursor = headlineRange.end + 2;
  const bodyRange = { start: cursor, end: cursor + body.length };
  cursor = bodyRange.end + 2;
  const disclaimerRange = { start: cursor, end: cursor + disclaimer.length };
  cursor = disclaimerRange.end + 2;
  const ctaRange = { start: cursor, end: cursor + cta.length };

  const spanText = "guaranteed returns";
  const spanStart = canonicalText.indexOf(spanText);
  const findings = baseFindings.map((finding) => {
    if (finding.ruleId !== "SEBI-06") {
      return finding;
    }
    return {
      ...finding,
      spans: [{ start: spanStart, end: spanStart + spanText.length, text: spanText }],
    };
  });

  return {
    ...assetBDetail,
    canonicalText,
    fieldOffsets: {
      headline: headlineRange,
      body: bodyRange,
      disclaimer: disclaimerRange,
      cta: ctaRange,
    },
    findings,
    exportedAt: "2026-03-15T14:00:00.000Z",
    snapshots: [
      {
        ruleId: "SEBI-01",
        kind: "deterministic",
        wording: FROZEN_WORDING["SEBI-01"],
      },
      {
        ruleId: "SEBI-02",
        kind: "deterministic",
        wording: FROZEN_WORDING["SEBI-02"],
      },
      {
        ruleId: "SEBI-06",
        kind: "judgement",
        wording: FROZEN_WORDING["SEBI-06"],
      },
    ],
    generatorRun: null,
  };
}

const REPORT_FIXTURE = buildReportFixture();

export function ComplianceReportStates(): ReactElement {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-title text-fg">Compliance report states</h1>
      <p className="text-caption text-fg-muted">
        Live report at{" "}
        <Link
          to={`/assets/${ASSET_ID_B}/report`}
          className="text-primary underline"
        >
          /assets/:id/report
        </Link>
        .
      </p>
      <nav className="flex flex-col gap-2">
        <Link
          to="/design-proof/compliance-report/loaded"
          className="text-ui text-primary underline"
        >
          Loaded (fixture B)
        </Link>
        <Link
          to="/design-proof/compliance-report/loading"
          className="text-ui text-primary underline"
        >
          Loading
        </Link>
        <Link
          to="/design-proof/compliance-report/error"
          className="text-ui text-primary underline"
        >
          Error
        </Link>
        <Link
          to="/design-proof/compliance-report/not-found"
          className="text-ui text-primary underline"
        >
          Not found
        </Link>
      </nav>
    </div>
  );
}

export function ComplianceReportLoadedDemo(): ReactElement {
  return (
    <ComplianceReport
      report={REPORT_FIXTURE}
      onDownload={() => undefined}
    />
  );
}

export function ComplianceReportLoadingDemo(): ReactElement {
  return <ReportLoadingState showSpinner={true} />;
}

export function ComplianceReportErrorDemo(): ReactElement {
  return <ReportErrorState />;
}

export function ComplianceReportNotFoundDemo(): ReactElement {
  return <ReportNotFoundState />;
}
