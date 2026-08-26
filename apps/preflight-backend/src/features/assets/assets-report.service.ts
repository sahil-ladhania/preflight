/**
 * assets-report.service — compliance report export (G-15).
 * Why: read-only pack = detail + freeze snapshot wordings.
 */
import type { ComplianceReportDTO } from "@preflight/schemas";

import { prisma } from "../../lib/prisma.js";
import { getAssetDetail } from "./assets.service.js";

export async function getAssetReport(id: string): Promise<ComplianceReportDTO> {
  const detail = await getAssetDetail(id);
  const snapshots = await prisma.constraintSnapshot.findMany({
    where: { constraintSetId: detail.constraintSetId },
    select: { ruleId: true, kind: true, wording: true },
    orderBy: { ruleId: "asc" },
  });

  return {
    ...detail,
    exportedAt: new Date().toISOString(),
    snapshots: snapshots.map((row) => ({
      ruleId: row.ruleId,
      kind: row.kind as ComplianceReportDTO["snapshots"][number]["kind"],
      wording: row.wording,
    })),
  };
}
