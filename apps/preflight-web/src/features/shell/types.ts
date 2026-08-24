/**
 * types — shell-only client shapes.
 * Why: toast and error-boundary state are not wire DTOs.
 */

export interface ErrorBoundaryState {
  hasError: boolean;
}

export interface ToastItem {
  id: string;
  message: string;
}

export interface ToastContextValue {
  enqueue: (message: string) => void;
}
