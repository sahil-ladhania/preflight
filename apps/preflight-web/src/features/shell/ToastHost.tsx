/**
 * ToastHost — R2 global toast stack.
 * Why: max 3 toasts, 5s auto-dismiss.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import type { ToastContextValue, ToastItem } from "@/features/shell/types";

const TOAST_MAX = 3;
const TOAST_DISMISS_MS = 5000;

const ToastContext = createContext<ToastContextValue | null>(null);

function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}): ReactElement | null {
  if (toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div
      className="fixed top-16 right-4 z-50 flex w-80 flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="cursor-pointer rounded-md border border-border bg-canvas px-4 py-3 text-left text-body text-fg"
        >
          {toast.message}
        </button>
      ))}
    </div>,
    document.body,
  );
}

export function ToastHost({ children }: { children: ReactNode }): ReactElement {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutIdsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const dismiss = useCallback((id: string): void => {
    const timeoutId = timeoutIdsRef.current.get(id);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutIdsRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const enqueue = useCallback(
    (message: string): void => {
      const id = crypto.randomUUID();
      const nextToast: ToastItem = { id, message };

      setToasts((current) => {
        const next = [...current, nextToast];
        if (next.length <= TOAST_MAX) {
          return next;
        }
        const dropped = next[0];
        if (dropped !== undefined) {
          const droppedTimeout = timeoutIdsRef.current.get(dropped.id);
          if (droppedTimeout !== undefined) {
            clearTimeout(droppedTimeout);
            timeoutIdsRef.current.delete(dropped.id);
          }
        }
        return next.slice(-TOAST_MAX);
      });

      const timeoutId = setTimeout(() => {
        dismiss(id);
      }, TOAST_DISMISS_MS);
      timeoutIdsRef.current.set(id, timeoutId);
    },
    [dismiss],
  );

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current;
    return () => {
      for (const timeoutId of timeoutIds.values()) {
        clearTimeout(timeoutId);
      }
      timeoutIds.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ enqueue }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error("useToastContext must be used within ToastHost");
  }
  return context;
}
