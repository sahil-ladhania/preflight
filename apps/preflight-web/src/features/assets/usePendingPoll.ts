/**
 * usePendingPoll — shared 1000ms poll helper.
 * Why: list and detail second use.
 */

import { useEffect, useRef } from "react";

export function usePendingPoll(
  fetch: () => Promise<void>,
  active: boolean,
  intervalMs = 1000,
): void {
  const fetchRef = useRef(fetch);
  fetchRef.current = fetch;

  useEffect(() => {
    if (!active) {
      return;
    }

    let cancelled = false;

    const tick = async (): Promise<void> => {
      try {
        await fetchRef.current();
      } catch {
        // Poll errors are handled inside fetch.
      }
    };

    void tick();

    const intervalId = window.setInterval(() => {
      if (cancelled) {
        return;
      }
      void tick();
    }, intervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [active, intervalMs]);
}
