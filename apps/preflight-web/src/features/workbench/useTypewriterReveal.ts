/**
 * useTypewriterReveal — bounded client-side text reveal after complete response.
 * Why: perceived progress without SSE; skip on interaction; respect reduced motion.
 */

import { useCallback, useEffect, useState } from "react";

const TICK_MS = 16;
const MIN_DURATION_MS = 1200;
const MAX_DURATION_MS = 2500;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function revealBudgetMs(textLength: number): number {
  const scaled = textLength * 6;
  return Math.min(MAX_DURATION_MS, Math.max(MIN_DURATION_MS, scaled));
}

function charsPerTick(textLength: number): number {
  const budget = revealBudgetMs(textLength);
  const ticks = Math.max(1, Math.floor(budget / TICK_MS));
  return Math.max(1, Math.ceil(textLength / ticks));
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
  const [skipped, setSkipped] = useState<boolean>(false);

  const skip = useCallback((): void => {
    setSkipped(true);
    setVisibleText(fullText);
    setIsComplete(true);
  }, [fullText]);

  useEffect(() => {
    if (!active || prefersReducedMotion()) {
      setVisibleText(fullText);
      setIsComplete(true);
      return;
    }

    setSkipped(false);
    setVisibleText("");
    setIsComplete(false);
    let index = 0;
    const step = charsPerTick(fullText.length);

    const timer = window.setInterval(() => {
      index += step;
      if (index >= fullText.length) {
        setVisibleText(fullText);
        setIsComplete(true);
        window.clearInterval(timer);
        return;
      }
      setVisibleText(fullText.slice(0, index));
    }, TICK_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [fullText, active]);

  useEffect(() => {
    if (!active || isComplete || skipped) {
      return;
    }

    const onSkip = (): void => {
      skip();
    };

    window.addEventListener("keydown", onSkip);
    window.addEventListener("click", onSkip);
    return () => {
      window.removeEventListener("keydown", onSkip);
      window.removeEventListener("click", onSkip);
    };
  }, [active, isComplete, skip, skipped]);

  useEffect(() => {
    if (skipped) {
      setVisibleText(fullText);
      setIsComplete(true);
    }
  }, [fullText, skipped]);

  return { visibleText, isComplete };
}
