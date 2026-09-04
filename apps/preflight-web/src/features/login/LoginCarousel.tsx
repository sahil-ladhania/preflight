/**
 * LoginCarousel — three-slide crossfade with clickable dots.
 * Why: sanctioned motion containment (08 §3.6); no new dependency.
 */

import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";

import { LOGIN_CAROUSEL_SLIDES } from "@/features/login/lib";

const INTERVAL_MS = 5500;
const SLIDE_COUNT = LOGIN_CAROUSEL_SLIDES.length;

export function LoginCarousel(): ReactElement {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clearTimer = useCallback((): void => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback((): void => {
    if (prefersReducedMotion) return;
    clearTimer();
    intervalRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setActive((prev) => (prev + 1) % SLIDE_COUNT);
      }
    }, INTERVAL_MS);
  }, [clearTimer, prefersReducedMotion]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  const pause = useCallback(() => { pausedRef.current = true; }, []);
  const resume = useCallback(() => { pausedRef.current = false; }, []);

  return (
    <div
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      className="flex flex-col gap-5"
    >
      <div className="relative h-[88px]">
        {LOGIN_CAROUSEL_SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 flex flex-col gap-2"
            style={{
              opacity: i === active ? 1 : 0,
              transition: prefersReducedMotion ? "none" : "opacity 600ms ease",
              pointerEvents: i === active ? "auto" : "none",
            }}
            aria-hidden={i !== active}
          >
            <h2 className="font-serif text-[18px] font-semibold leading-[1.3] text-[#fffdf9]">
              {slide.heading}
            </h2>
            <p className="font-serif text-[14px] font-normal leading-[22px] text-[#fffdf9]/70">
              {slide.line}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2.5" role="tablist" aria-label="Journey slides">
        {LOGIN_CAROUSEL_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Slide ${i + 1}`}
            onClick={() => { setActive(i); startTimer(); }}
            className="p-0 border-0 bg-transparent cursor-pointer"
          >
            {i === active ? (
              <span className="block h-[3px] w-5 rounded-none bg-[#fffdf9]" />
            ) : (
              <span className="block h-1.5 w-1.5 rounded-full border border-[#fffdf9]/50 bg-transparent" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
