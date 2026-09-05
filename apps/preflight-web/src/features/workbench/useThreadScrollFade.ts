/**
 * useThreadScrollFade — top fade when the thread scrolls above the fold.
 * Why: light cue that earlier turns exist without a page heading or rule.
 */

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export function useThreadScrollFade(messageCount: number): {
  scrollRef: RefObject<HTMLDivElement | null>;
  showTopFade: boolean;
  onScroll: () => void;
} {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = useState<boolean>(false);

  const updateFade = useCallback((): void => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    setShowTopFade(el.scrollTop > 4);
  }, []);

  useEffect(() => {
    updateFade();
  }, [messageCount, updateFade]);

  return {
    scrollRef,
    showTopFade,
    onScroll: updateFade,
  };
}
