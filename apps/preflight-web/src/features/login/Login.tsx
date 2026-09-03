/**
 * Login — Screen 0 institutional sign-in.
 * Why: pre-app gate; mock credentials only, no backend auth.
 */

import type { FormEvent, ReactElement } from "react";
import { Loader2 } from "lucide-react";

import { LoginBrandPanel } from "@/features/login/LoginBrandPanel";
import { LOGIN_COPY, SSO_PROVIDERS, type SsoProvider } from "@/features/login/lib";
import { useLogin } from "@/features/login/useLogin";
import { SsoIcon } from "@/features/login/SsoIcons";
import { cn } from "@/lib/utils";

const loginFieldClass = cn(
  "box-border w-full border border-border bg-transparent px-3 py-2",
  "text-ui text-primary outline-none placeholder:text-fg-faint",
  "focus-visible:border-ring rounded-none",
);

const loginButtonQuietClass = cn(
  "flex h-8 w-full cursor-pointer items-center justify-center gap-2",
  "border border-primary bg-transparent text-button text-primary rounded-none",
);

function SsoProviderButton({ provider }: { provider: SsoProvider }): ReactElement {
  return (
    <button
      type="button"
      className={loginButtonQuietClass}
      onClick={() => {
        /* mock — SSO not wired */
      }}
    >
      <SsoIcon id={provider.id} />
      {provider.label}
    </button>
  );
}

function SsoDivider(): ReactElement {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
      <span className="text-caption text-fg-muted">{LOGIN_COPY.ssoDividerLabel}</span>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}

function LoginForm(): ReactElement {
  const {
    userId,
    password,
    error,
    submitting,
    setUserId,
    setPassword,
    handleSubmit,
  } = useLogin();

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void handleSubmit();
  }

  return (
    <form
      className="flex w-full max-w-[360px] flex-col gap-3.5 border border-border bg-surface p-6"
      onSubmit={onSubmit}
    >
      <h2 className="text-label-strong text-primary uppercase">
        {LOGIN_COPY.panelTitle}
      </h2>

      <div className="flex flex-col gap-2">
        {SSO_PROVIDERS.map((provider) => (
          <SsoProviderButton key={provider.id} provider={provider} />
        ))}
      </div>

      <SsoDivider />

      <label className="flex flex-col gap-1.5">
        <span className="text-label uppercase text-fg-muted">
          {LOGIN_COPY.userIdLabel}
        </span>
        <input
          type="text"
          name="userId"
          autoComplete="username"
          placeholder={LOGIN_COPY.userIdPlaceholder}
          value={userId}
          disabled={submitting}
          onChange={(event) => {
            setUserId(event.target.value);
          }}
          className={loginFieldClass}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-label uppercase text-fg-muted">
          {LOGIN_COPY.passwordLabel}
        </span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder={LOGIN_COPY.passwordPlaceholder}
          value={password}
          disabled={submitting}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          className={loginFieldClass}
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="flex h-8 w-full cursor-pointer items-center justify-center border border-primary bg-primary text-button text-primary-foreground rounded-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          LOGIN_COPY.submitLabel
        )}
      </button>

      {error !== null ? (
        <p className="text-caption text-fg-muted">{error}</p>
      ) : null}

      <p className="text-caption text-fg-muted">{LOGIN_COPY.accountabilityLine}</p>
    </form>
  );
}

export function LoginRoute(): ReactElement {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <LoginBrandPanel className="md:w-[55%]" />

      <div className="flex flex-1 items-center justify-center border-border bg-ground px-4 py-10 md:w-[45%] md:border-l md:py-0">
        <LoginForm />
      </div>
    </div>
  );
}
