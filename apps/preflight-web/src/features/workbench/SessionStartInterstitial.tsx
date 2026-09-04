/**
 * SessionStartInterstitial — designed session opening transition for Workbench.
 * Why: 08 §6 motion budget; backdrop blur with centered serif line "Starting your session."
 */

import { useEffect, useState, type ReactElement } from "react";
import { cn } from "@/lib/utils";

export interface SessionStartInterstitialProps {
  isFadingOut?: boolean;
}

export function SessionStartInterstitial({
  isFadingOut = false,
}: SessionStartInterstitialProps): ReactElement {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    // Trigger fade-in on next frame
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      role="status"
      className={cn(
        "absolute inset-0 z-20 flex items-center justify-center backdrop-blur-md bg-ground/30 transition-opacity duration-200",
        mounted && !isFadingOut ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <h2 className="font-serif text-subject-title text-fg font-semibold text-center tracking-tight select-none">
        Starting your session.
      </h2>
    </div>
  );
}
