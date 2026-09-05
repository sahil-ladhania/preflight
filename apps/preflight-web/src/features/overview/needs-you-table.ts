/**
 * needs-you-table — shared grid for Overview queue header and rows.
 * Why: horizontal scroll keeps Reason readable; min width matches column mins so row borders span Age.
 */

export const OVERVIEW_QUEUE_GRID =
  "grid w-full grid-cols-[110px_minmax(180px,1.2fr)_120px_minmax(140px,1fr)_minmax(220px,1.6fr)_150px] gap-x-3";

/** 110+180+120+140+220+150 + five gap-3 (12px) gutters */
export const OVERVIEW_QUEUE_TABLE =
  "flex w-max min-w-full flex-col";
