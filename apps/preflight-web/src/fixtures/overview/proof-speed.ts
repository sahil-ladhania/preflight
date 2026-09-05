/**
 * proof-speed — twelve-week median time-to-clear series for Overview.
 * Why: downward trend with one uptick week proves the chart reads honestly.
 */

import type { ProofSpeedSnapshot } from "@/features/overview/types";

export const OVERVIEW_PROOF_SPEED: ProofSpeedSnapshot = {
  medianHoursToClear: 18,
  regenerationsPerAsset: 1.4,
  firstPassRatePercent: 61,
  weeklyMedianHours: [
    { weekLabel: "Dec 16", medianHours: 52 },
    { weekLabel: "Dec 23", medianHours: 48 },
    { weekLabel: "Dec 30", medianHours: 44 },
    { weekLabel: "Jan 6", medianHours: 41 },
    { weekLabel: "Jan 13", medianHours: 38 },
    { weekLabel: "Jan 20", medianHours: 36 },
    { weekLabel: "Jan 27", medianHours: 34 },
    { weekLabel: "Feb 3", medianHours: 39 },
    { weekLabel: "Feb 10", medianHours: 31 },
    { weekLabel: "Feb 17", medianHours: 26 },
    { weekLabel: "Feb 24", medianHours: 22 },
    { weekLabel: "Mar 3", medianHours: 18 },
  ],
};
