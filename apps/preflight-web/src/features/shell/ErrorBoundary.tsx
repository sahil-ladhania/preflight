/**
 * ErrorBoundary — RERR render crash fallback.
 * Why: keeps top bar visible below render errors.
 */

import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { ErrorBoundaryState } from "@/features/shell/types";

interface ErrorBoundaryProps {
  children: ReactNode;
}

// pattern: class component — React error boundaries have no function equivalent
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error("Render error:", error, info.componentStack);
    }
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-below-topbar flex-col items-center justify-center gap-4 px-4">
          <p className="text-caption text-fg-muted">
            Something went wrong rendering this page.
          </p>
          <Button type="button" variant="outline" onClick={this.handleReload}>
            Reload
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
