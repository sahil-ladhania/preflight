/**
 * types — shell-only client shapes.
 * Why: toast and error-boundary state are not wire DTOs.
 */

export interface ErrorBoundaryState {
  hasError: boolean;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
}

export interface ToastContextValue {
  enqueue: (message: string, type?: ToastType) => void;
}

export interface CampaignNavTarget {
  navigating: boolean;
  navigateToCampaign: () => Promise<void>;
}

export interface CampaignNavLinkProps {
  navigating: boolean;
  isActive: boolean;
  onNavigate: () => void;
}

export type PersonaId = "meera" | "arjun";

export interface SessionActor {
  id: PersonaId;
  name: string;
  role: "CAMPAIGN OWNER" | "COMPLIANCE REVIEWER";
}

export interface PersonaControlProps {
  actor: SessionActor;
}

export interface PersonaHomeNavigation {
  navigatingHome: boolean;
  goHome: () => Promise<void>;
}
