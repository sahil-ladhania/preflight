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
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

import type {
  ToastContextValue,
  ToastItem,
  ToastType,
} from "@/features/shell/types";
import { cn } from "@/lib/utils";

const TOAST_MAX = 3;
const TOAST_DISMISS_MS = 5000;

const ToastContext = createContext<ToastContextValue | null>(null);

function inferToastType(message: string, explicitType?: ToastType): ToastType {
  if (explicitType !== undefined) {
    return explicitType;
  }
  const lower = message.toLowerCase();
  if (
    lower.includes("error") ||
    lower.includes("fail") ||
    lower.includes("could not") ||
    lower.includes("invalid") ||
    lower.includes("blocked")
  ) {
    return "error";
  }
  if (
    lower.includes("handed off") ||
    lower.includes("downloaded") ||
    lower.includes("success") ||
    lower.includes("saved") ||
    lower.includes("created") ||
    lower.includes("ready") ||
    lower.includes("copied") ||
    lower.includes("cleared")
  ) {
    return "success";
  }
  if (
    lower.includes("warning") ||
    lower.includes("caution") ||
    lower.includes("waived") ||
    lower.includes("exception")
  ) {
    return "warning";
  }
  return "info";
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}): ReactElement {
  const type = inferToastType(toast.message, toast.type);

  let icon: ReactElement;
  let label: string;
  let borderClass: string;
  let badgeClass: string;

  switch (type) {
    case "success":
      icon = (
        <CheckCircle2
          className="size-4 shrink-0 text-pass mt-0.5"
          strokeWidth={2}
          aria-hidden
        />
      );
      label = "Confirmation";
      borderClass = "border-border border-l-[3.5px] border-l-pass";
      badgeClass = "text-pass";
      break;
    case "error":
      icon = (
        <AlertOctagon
          className="size-4 shrink-0 text-fail mt-0.5"
          strokeWidth={2}
          aria-hidden
        />
      );
      label = "Error";
      borderClass = "border-border border-l-[3.5px] border-l-fail";
      badgeClass = "text-fail";
      break;
    case "warning":
      icon = (
        <AlertTriangle
          className="size-4 shrink-0 text-attention mt-0.5"
          strokeWidth={2}
          aria-hidden
        />
      );
      label = "Notice";
      borderClass = "border-border border-l-[3.5px] border-l-attention";
      badgeClass = "text-attention";
      break;
    case "info":
    default:
      icon = (
        <Info
          className="size-4 shrink-0 text-primary mt-0.5"
          strokeWidth={2}
          aria-hidden
        />
      );
      label = "Update";
      borderClass = "border-border border-l-[3.5px] border-l-primary";
      badgeClass = "text-primary";
      break;
  }

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-none border bg-surface p-4 text-left shadow-[2px_2px_0px_rgba(28,26,23,0.12)] transition-all",
        borderClass,
      )}
    >
      {icon}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "font-mono text-mono-meta uppercase tracking-wider font-semibold",
              badgeClass,
            )}
          >
            {label}
          </span>
        </div>
        <p className="font-sans text-caption leading-relaxed text-fg select-text">
          {toast.message}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 p-1 text-fg-muted hover:text-fg hover:bg-hover rounded-none transition-colors cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

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
      className="fixed top-6 right-6 md:right-8 z-50 flex w-full max-w-sm flex-col gap-2.5 pointer-events-none sm:max-w-[400px]"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
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
    (message: string, type?: ToastType): void => {
      const id = crypto.randomUUID();
      const nextToast: ToastItem = { id, message, type };

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
