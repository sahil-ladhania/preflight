/**
 * useDelayedLoading — delay spinner until loading persists.
 * Why: avoid flash on fast GETs (15-frontend-design.md §4.1).
 */

import { useEffect, useState } from "react";

export function useDelayedLoading(
  isLoading: boolean,
  delayMs = 300,
): boolean {
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading) {
      setShowSpinner(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowSpinner(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isLoading, delayMs]);

  return showSpinner;
}
