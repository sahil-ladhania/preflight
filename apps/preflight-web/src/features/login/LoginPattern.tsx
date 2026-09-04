/**
 * LoginPattern — ledger-grid texture for the dark login brand panel.
 * Why: paper/record motif at low opacity over the gradient ground (08 §3.6).
 */

import type { ReactElement } from "react";

import { RegisterGrid } from "@/features/shell/RegisterGrid";

export interface LoginPatternProps {
  className?: string;
}

export function LoginPattern({ className }: LoginPatternProps): ReactElement {
  return <RegisterGrid className={className} />;
}

