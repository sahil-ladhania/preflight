/**
 * lib — Screen 0 static copy and mock credential stub.
 * Why: login is a mock gate; credential routing wired in a follow-up.
 */

export const LOGIN_COPY = {
  wordmark: "Preflight",
  tagline: "A record of what was checked, and why it shipped.",
  panelTitle: "Sign in",
  userIdLabel: "User ID",
  userIdPlaceholder: "meera.menon@fundhouse.in",
  passwordLabel: "Password",
  passwordPlaceholder: "••••••••",
  submitLabel: "Sign in",
  ssoDividerLabel: "or",
  accountabilityLine: "Sign-in is recorded under your assigned name.",
} as const;

/** Fallback raster — primary render uses LoginPattern.tsx. */
export const LOGIN_PATTERN_SRC = "/login-register-pattern.svg";

export type SsoProviderId = "microsoft" | "okta" | "ping";

export interface SsoProvider {
  id: SsoProviderId;
  label: string;
}

/** Enterprise IdPs common in regulated AMC deployments — visual only for now. */
export const SSO_PROVIDERS: readonly SsoProvider[] = [
  { id: "microsoft", label: "Sign in with Microsoft" },
  { id: "okta", label: "Sign in with Okta" },
  { id: "ping", label: "Sign in with Ping Identity" },
];

export interface MockCredentialEntry {
  password: string;
  personaId: "meera" | "arjun";
}

/** Reserved for submit handler — not wired on this screen yet. */
export const MOCK_CREDENTIALS: Record<string, MockCredentialEntry> = {
  "meera.menon@fundhouse.in": { password: "demo", personaId: "meera" },
  "arjun.legha@fundhouse.in": { password: "demo", personaId: "arjun" },
};
