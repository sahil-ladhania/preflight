/**
 * OverviewStates — design-proof route for empty Needs you queue.
 * Why: verify empty queue without mutating default Overview fixture in product.
 */

import type { ReactElement } from "react";

import { Overview } from "@/features/overview/Overview";
import { OVERVIEW_EMPTY_QUEUE_FIXTURE } from "@/fixtures/overview";

export function OverviewEmptyQueueDemo(): ReactElement {
  return <Overview data={OVERVIEW_EMPTY_QUEUE_FIXTURE} />;
}
