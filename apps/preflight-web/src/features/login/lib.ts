/**
 * lib — Screen 0 static copy and mock credential stub.
 * Why: login is a mock gate; credential routing is client-only.
 */

import type { Location } from "react-router-dom";

import type { PersonaId } from "@/features/shell/types";

export const LOGIN_SIGN_OUT_INTENT = "sign-out" as const;

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
  invalidCredentials: "Those credentials are not a demo account.",
  landingFailed: "Could not open your workspace. Try again.",
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
  personaId: PersonaId;
}

export const MOCK_CREDENTIALS: Record<string, MockCredentialEntry> = {
  "meera.menon@fundhouse.in": { password: "demo", personaId: "meera" },
  "arjun.legha@fundhouse.in": { password: "demo", personaId: "arjun" },
};

export function matchMockCredentials(
  userId: string,
  password: string,
): PersonaId | null {
  const normalizedUserId = userId.trim().toLowerCase();
  const entry = MOCK_CREDENTIALS[normalizedUserId];
  if (entry === undefined || entry.password !== password) {
    return null;
  }
  return entry.personaId;
}

function pathFromLocation(from: Location): string {
  return `${from.pathname}${from.search}${from.hash}`;
}

/** Arjun opens on the register; Meera resolves latest campaign unless deep-linked. */
export function loginDestinationForPersona(
  personaId: PersonaId,
  from: Location | undefined,
): string | "resolve-campaign" {
  if (personaId === "arjun") {
    if (from !== undefined && from.pathname.startsWith("/assets")) {
      return pathFromLocation(from);
    }
    return "/assets";
  }

  if (
    from !== undefined &&
    from.pathname !== "/" &&
    !from.pathname.startsWith("/login")
  ) {
    return pathFromLocation(from);
  }

  return "resolve-campaign";
}
