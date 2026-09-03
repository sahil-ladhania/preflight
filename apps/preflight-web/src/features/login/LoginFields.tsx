/**
 * LoginFields — identity, password, and SSO step fields.
 * Why: the card replaces the step in place; brand panel stays put.
 */

import type { ReactElement } from "react";

import {
  formatSsoContinueLabel,
  LOGIN_COPY,
  type LoginBusy,
  type LoginStep,
} from "@/features/login/lib";
import { cn } from "@/lib/utils";

export const loginFieldClass = cn(
  "box-border h-9 w-full min-w-0 rounded-none border border-solid border-hairline bg-transparent px-3 py-2",
  "font-sans text-(length:--text-ui) leading-[1.4] font-normal text-fg shadow-none outline-none",
  "placeholder:font-sans placeholder:text-(length:--text-ui) placeholder:leading-[1.4] placeholder:font-normal placeholder:not-italic placeholder:text-fg-faint",
  "focus-visible:border-decision disabled:text-fg-faint",
  "appearance-none [&::-ms-reveal]:hidden [&::-webkit-caps-lock-indicator]:hidden",
  "[&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden",
);

export const plainLinkClass = cn(
  "cursor-pointer border-0 bg-transparent p-0 font-sans text-(length:--text-caption) leading-[18px] font-normal text-fg-muted underline underline-offset-4",
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-decision",
);

export interface LoginEchoedEmailProps {
  email: string;
  onChangeEmail: () => void;
}

export function LoginEchoedEmail({
  email,
  onChangeEmail,
}: LoginEchoedEmailProps): ReactElement {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <p className="min-w-0 truncate font-sans text-(length:--text-label) leading-[1.4] font-normal tracking-[0.04em] normal-case text-fg-muted">
        {email}
      </p>
      <button type="button" className={plainLinkClass} onClick={onChangeEmail}>
        {LOGIN_COPY.changeLabel}
      </button>
    </div>
  );
}

export interface LoginIdentityFieldsProps {
  email: string;
  disabled: boolean;
  onEmailChange: (value: string) => void;
}

export function LoginIdentityFields({
  email,
  disabled,
  onEmailChange,
}: LoginIdentityFieldsProps): ReactElement {
  return (
    <label className="flex flex-col gap-1.5" htmlFor="login-email">
      <span className="font-sans text-(length:--text-label) leading-[1.4] font-normal tracking-[0.04em] uppercase text-fg-muted">
        {LOGIN_COPY.emailLabel}
      </span>
      <input
        id="login-email"
        type="email"
        name="email"
        autoComplete="username"
        autoFocus
        placeholder={LOGIN_COPY.emailPlaceholder}
        value={email}
        disabled={disabled}
        onChange={(event) => {
          onEmailChange(event.target.value);
        }}
        className={loginFieldClass}
      />
    </label>
  );
}

export interface LoginPasswordFieldsProps {
  email: string;
  password: string;
  disabled: boolean;
  onChangeEmail: () => void;
  onPasswordChange: (value: string) => void;
}

export function LoginPasswordFields({
  email,
  password,
  disabled,
  onChangeEmail,
  onPasswordChange,
}: LoginPasswordFieldsProps): ReactElement {
  return (
    <>
      <LoginEchoedEmail email={email} onChangeEmail={onChangeEmail} />
      <label className="flex flex-col gap-1.5" htmlFor="login-password">
        <span className="font-sans text-(length:--text-label) leading-[1.4] font-normal tracking-[0.04em] uppercase text-fg-muted">
          {LOGIN_COPY.passwordLabel}
        </span>
        <input
          id="login-password"
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          disabled={disabled}
          onChange={(event) => {
            onPasswordChange(event.target.value);
          }}
          className={loginFieldClass}
        />
      </label>
    </>
  );
}

export interface LoginSsoFieldsProps {
  email: string;
  onChangeEmail: () => void;
}

export function LoginSsoFields({
  email,
  onChangeEmail,
}: LoginSsoFieldsProps): ReactElement {
  return <LoginEchoedEmail email={email} onChangeEmail={onChangeEmail} />;
}

export interface LoginSubmitLabelProps {
  step: LoginStep;
  busy: LoginBusy;
  idpName: string | null;
}

export function loginSubmitLabel({
  step,
  busy,
  idpName,
}: LoginSubmitLabelProps): string {
  if (busy === "resolving") {
    return LOGIN_COPY.checkingLabel;
  }
  if (busy === "redirecting") {
    return LOGIN_COPY.redirectingLabel;
  }
  if (step === "sso" && idpName !== null) {
    return formatSsoContinueLabel(idpName);
  }
  if (step === "password") {
    return LOGIN_COPY.signInLabel;
  }
  return LOGIN_COPY.continueLabel;
}
