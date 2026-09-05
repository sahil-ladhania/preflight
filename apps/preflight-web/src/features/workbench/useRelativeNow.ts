/**
 * useRelativeNow — tick the clock for relative message timestamps.
 * Why: "5 minutes ago" should advance without one interval per message.
 */

import { useEffect, useState } from "react";

const TICK_MS = 30_000;

export function useRelativeNow(): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, TICK_MS);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return now;
}
