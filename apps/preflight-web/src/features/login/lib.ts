/**
 * lib — Screen 0 email-first tenant resolution and card copy.
 * Why: the gate reveals domains, never whether an address exists.
 */
// size: domain map, credentials, copy, carousel data, and format helpers co-located because all serve the login gate.

import type { Location } from "react-router-dom";

import type { PersonaId } from "@/features/shell/types";

export const LOGIN_SIGN_OUT_INTENT = "sign-out" as const;
export const LOGIN_INACTIVITY_INTENT = "inactivity" as const;
export const LOGIN_LOCKOUT_AFTER = 5;
export const LOGIN_LOCKOUT_MINUTES = 15;
export const LOGIN_RESOLVE_MS = 400;
export const LOGIN_REDIRECT_MS = 600;

export type LoginNoticeKind = "inactivity" | "signed-out" | "resume";
export type LoginStep = "identity" | "password" | "sso";
export type LoginBusy = "idle" | "resolving" | "submitting" | "redirecting";

export type TenantResolution =
  | { method: "unknown" }
  | { method: "password" }
  | { method: "sso"; idpName: string };

export const LOGIN_COPY = {
  wordmark: "Preflight",
  tagline: "A record of what was checked, and why it shipped.",
  emailLabel: "Work email",
  emailPlaceholder: "name@yourfirm.com",
  continueLabel: "Continue",
  checkingLabel: "Checking…",
  continueReason: "Enter your work email to continue.",
  unknownDomain:
    "We don't recognise that domain. Contact your Preflight administrator.",
  changeLabel: "Change",
  passwordLabel: "Password",
  signInLabel: "Sign in",
  forgotPassword: "Forgot password",
  ssoHint:
    "You'll sign in through your organisation's identity provider.",
  redirectingLabel: "Redirecting…",
  tryAgain: "Try again",
  accountabilityIdentity:
    "Preflight records who checked each asset and why it shipped.",
  accountabilityLine: "Every decision you make is recorded under this name.",
  invalidCredentials: "That email and password don't match.",
  landingFailed: "Could not open your workspace. Try again.",
  inactivityNotice: "You were signed out after 30 minutes of inactivity.",
  signedOutNotice: "You've been signed out.",
  resumeNotice: "Sign in to continue to the asset you opened.",
  supportLine: "Trouble signing in? Contact your Preflight administrator.",
  privacyLabel: "Privacy",
  termsLabel: "Terms",
  defaultSsoError: "The identity provider cancelled sign-in.",
} as const;

export interface CarouselSlide {
  heading: string;
  line: string;
}

export const LOGIN_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    heading: "Constraints before copy",
    line: "The rules that bind a campaign are frozen before a single word is written.",
  },
  {
    heading: "Every asset carries its evidence",
    line: "Rule by rule: what was checked, what passed, and the exact words that failed.",
  },
  {
    heading: "Defensible months later",
    line: "Frozen wording, preserved findings, and the name of whoever decided.",
  },
];

export const LOGIN_SSO_LABELS = {
  microsoft: "Continue with Microsoft",
  okta: "Continue with Okta",
} as const;

export const LOGIN_HEADING = {
  title: "Welcome back",
  subtitle: "Please provide your details to sign in.",
} as const;

export const LOGIN_NOTICE_COPY: Record<LoginNoticeKind, string> = {
  inactivity: LOGIN_COPY.inactivityNotice,
  "signed-out": LOGIN_COPY.signedOutNotice,
  resume: LOGIN_COPY.resumeNotice,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MOCK_TENANTS: Record<string, TenantResolution> = {
  "fundhouse.in": { method: "password" },
  "amc.example": { method: "sso", idpName: "Okta" },
};

interface MockCredentialEntry {
  password: string;
  personaId: PersonaId;
}

const MOCK_CREDENTIALS: Record<string, MockCredentialEntry> = {
  "meera.menon@fundhouse.in": { password: "demo", personaId: "meera" },
  "arjun.legha@fundhouse.in": { password: "demo", personaId: "arjun" },
};

export function isParseableEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function resolveTenant(email: string): TenantResolution {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at <= 0) {
    return { method: "unknown" };
  }
  return MOCK_TENANTS[trimmed.slice(at + 1)] ?? { method: "unknown" };
}

export function matchMockCredentials(
  userId: string,
  password: string,
): PersonaId | null {
  const entry = MOCK_CREDENTIALS[userId.trim().toLowerCase()];
  if (entry === undefined || entry.password !== password) {
    return null;
  }
  return entry.personaId;
}

export function formatLockoutMessage(minutes: number): string {
  return `Too many attempts. Try again in ${minutes} minutes, or contact your administrator.`;
}

export function formatSsoContinueLabel(idpName: string): string {
  return `Continue to ${idpName}`;
}

export function formatSsoRedirectingLine(idpName: string): string {
  return `Taking you to ${idpName}.`;
}

export function formatSsoError(reason: string): string {
  return `Sign-in didn't complete. ${reason}`;
}

export function loginAccountabilityLine(step: LoginStep): string {
  if (step === "identity") {
    return LOGIN_COPY.accountabilityIdentity;
  }
  return LOGIN_COPY.accountabilityLine;
}

export function loginNoticeFromLocation(state: {
  intent?: string;
  notice?: string;
  from?: { pathname: string };
}): LoginNoticeKind | null {
  if (state.intent === LOGIN_INACTIVITY_INTENT || state.notice === "inactivity") {
    return "inactivity";
  }
  if (state.intent === LOGIN_SIGN_OUT_INTENT || state.notice === "signed-out") {
    return "signed-out";
  }
  const path = state.from?.pathname;
  if (path === undefined || path === "/" || path.startsWith("/login")) {
    return null;
  }
  return "resume";
}

export function ssoErrorFromSearch(search: string): string | null {
  const reason = new URLSearchParams(search).get("sso_error");
  if (reason === null || reason.trim() === "") {
    return null;
  }
  return reason;
}

function pathFromLocation(from: Location): string {
  return `${from.pathname}${from.search}${from.hash}`;
}

/** Both personas open Overview unless deep-linked elsewhere. */
export function loginDestinationForPersona(
  _personaId: PersonaId,
  from: Location | undefined,
): string {
  if (
    from !== undefined &&
    from.pathname !== "/" &&
    !from.pathname.startsWith("/login")
  ) {
    return pathFromLocation(from);
  }

  return "/overview";
}
