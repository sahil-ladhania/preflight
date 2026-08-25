/**
 * useTypewriterReveal — client-side text reveal after complete response.
 * Why: perceived progress without SSE (09 Screen 5 cut).
 */

import { useEffect, useState } from "react";

const CHAR_INTERVAL_MS = 35;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useTypewriterReveal(
  fullText: string,
  active: boolean,
): { visibleText: string; isComplete: boolean } {
  const skipAnimation = !active || prefersReducedMotion();
  const [visibleText, setVisibleText] = useState<string>(
    skipAnimation ? fullText : "",
  );
  const [isComplete, setIsComplete] = useState<boolean>(skipAnimation);

  useEffect(() => {
    if (!active || prefersReducedMotion()) {
      setVisibleText(fullText);
      setIsComplete(true);
      return;
    }

    setVisibleText("");
    setIsComplete(false);
    let index = 0;

    const timer = window.setInterval(() => {
      index += 1;
      if (index >= fullText.length) {
        setVisibleText(fullText);
        setIsComplete(true);
        window.clearInterval(timer);
        return;
      }
      setVisibleText(fullText.slice(0, index));
    }, CHAR_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [fullText, active]);

  return { visibleText, isComplete };
}
