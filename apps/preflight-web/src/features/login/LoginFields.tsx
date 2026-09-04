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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const plainLinkClass = cn(
  "cursor-pointer border-0 bg-transparent p-0 font-sans text-(length:--text-caption) leading-[18px] font-normal text-fg-muted underline underline-offset-4",
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-decision hover:text-foreground",
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
      <Button
        type="button"
        variant="link"
        size="xs"
        className="h-auto p-0 font-sans text-(length:--text-caption) leading-[18px] font-normal text-fg-muted underline underline-offset-4 hover:text-foreground"
        onClick={onChangeEmail}
      >
        {LOGIN_COPY.changeLabel}
      </Button>
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
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="login-email">
        {LOGIN_COPY.emailLabel}
      </Label>
      <Input
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
      />
    </div>
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
    <div className="flex flex-col gap-4">
      <LoginEchoedEmail email={email} onChangeEmail={onChangeEmail} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-password">
          {LOGIN_COPY.passwordLabel}
        </Label>
        <Input
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
        />
      </div>
    </div>
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
