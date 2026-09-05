/**
 * useAutoResizeTextarea — grow textarea height with content up to a cap.
 * Why: thread composer should expand with pasted briefs without manual resize.
 */

import { useEffect, useRef, type RefObject } from "react";

export function useAutoResizeTextarea(
  value: string,
  maxHeightPx: number,
): RefObject<HTMLTextAreaElement | null> {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeightPx)}px`;
  }, [value, maxHeightPx]);

  return ref;
}
