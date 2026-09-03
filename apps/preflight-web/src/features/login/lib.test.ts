/**
 * lib.test — email-first tenant resolution and login card copy.
 * Why: domain discovery must not disclose whether an address exists.
 */
// size: email, tenant, copy, notice, and destination cases stay together so the gate cannot split.

import { describe, expect, it } from "vitest";

import {
  formatLockoutMessage,
  formatSsoContinueLabel,
  formatSsoError,
  formatSsoRedirectingLine,
  isParseableEmail,
  LOGIN_COPY,
  loginAccountabilityLine,
  loginDestinationForPersona,
  loginNoticeFromLocation,
  matchMockCredentials,
  resolveTenant,
  ssoErrorFromSearch,
} from "@/features/login/lib";

describe("isParseableEmail", () => {
  it("accepts a work email", () => {
    expect(isParseableEmail("meera.menon@fundhouse.in")).toBe(true);
  });

  it("rejects empty, incomplete, and spaced values", () => {
    expect(isParseableEmail("")).toBe(false);
    expect(isParseableEmail("meera")).toBe(false);
    expect(isParseableEmail("meera@fundhouse")).toBe(false);
    expect(isParseableEmail("meera @fundhouse.in")).toBe(false);
  });

  it("trims before parsing", () => {
    expect(isParseableEmail("  arjun.legha@fundhouse.in  ")).toBe(true);
  });
});

describe("resolveTenant", () => {
  it("resolves the password tenant by domain, not by whether the address exists", () => {
    expect(resolveTenant("unknown@fundhouse.in")).toEqual({ method: "password" });
    expect(resolveTenant("meera.menon@fundhouse.in")).toEqual({
      method: "password",
    });
  });

  it("resolves the SSO tenant to one IdP name", () => {
    expect(resolveTenant("anyone@amc.example")).toEqual({
      method: "sso",
      idpName: "Okta",
    });
  });

  it("does not distinguish unknown addresses from unknown domains beyond the domain", () => {
    expect(resolveTenant("nobody@not-a-customer.com")).toEqual({
      method: "unknown",
    });
  });

  it("normalizes domain casing", () => {
    expect(resolveTenant("User@FundHouse.IN")).toEqual({ method: "password" });
  });
});

describe("matchMockCredentials", () => {
  it("accepts Meera demo credentials", () => {
    expect(
      matchMockCredentials("meera.menon@fundhouse.in", "demo"),
    ).toBe("meera");
  });

  it("accepts Arjun demo credentials", () => {
    expect(
      matchMockCredentials("arjun.legha@fundhouse.in", "demo"),
    ).toBe("arjun");
  });

  it("normalizes user id casing and whitespace", () => {
    expect(
      matchMockCredentials("  Meera.Menon@Fundhouse.IN  ", "demo"),
    ).toBe("meera");
  });

  it("returns the same result for a wrong password and an unknown address", () => {
    expect(
      matchMockCredentials("meera.menon@fundhouse.in", "wrong"),
    ).toBeNull();
    expect(
      matchMockCredentials("unknown@fundhouse.in", "demo"),
    ).toBeNull();
  });
});

describe("login card copy", () => {
  it("keeps invalid credentials identical for both failure causes", () => {
    expect(LOGIN_COPY.invalidCredentials).toBe(
      "That email and password don't match.",
    );
  });

  it("does not disclose demo addresses in the placeholder", () => {
    expect(LOGIN_COPY.emailPlaceholder).toBe("name@yourfirm.com");
    expect(LOGIN_COPY.emailPlaceholder.includes("@fundhouse")).toBe(false);
  });

  it("does not refer to a name on the identity step", () => {
    expect(loginAccountabilityLine("identity")).toBe(
      "Preflight records who checked each asset and why it shipped.",
    );
  });

  it("uses the named-actor sentence after the email is echoed", () => {
    expect(loginAccountabilityLine("password")).toBe(
      "Every decision you make is recorded under this name.",
    );
    expect(loginAccountabilityLine("sso")).toBe(
      loginAccountabilityLine("password"),
    );
  });

  it("formats lockout, SSO continue, redirect, and error", () => {
    expect(formatLockoutMessage(15)).toBe(
      "Too many attempts. Try again in 15 minutes, or contact your administrator.",
    );
    expect(formatSsoContinueLabel("Okta")).toBe("Continue to Okta");
    expect(formatSsoRedirectingLine("Okta")).toBe("Taking you to Okta.");
    expect(formatSsoError("The identity provider cancelled sign-in.")).toBe(
      "Sign-in didn't complete. The identity provider cancelled sign-in.",
    );
  });
});

describe("loginNoticeFromLocation", () => {
  it("prefers inactivity over other notices", () => {
    expect(
      loginNoticeFromLocation({
        intent: "inactivity",
        from: { pathname: "/assets/xyz" },
      }),
    ).toBe("inactivity");
  });

  it("reads an explicit signed-out notice after sign-out", () => {
    expect(loginNoticeFromLocation({ notice: "signed-out" })).toBe(
      "signed-out",
    );
    expect(loginNoticeFromLocation({ intent: "sign-out" })).toBe("signed-out");
  });

  it("treats a protected from-path as deep-link resume", () => {
    expect(
      loginNoticeFromLocation({ from: { pathname: "/assets/xyz" } }),
    ).toBe("resume");
  });

  it("does not treat root or login as a resume", () => {
    expect(loginNoticeFromLocation({ from: { pathname: "/" } })).toBeNull();
    expect(loginNoticeFromLocation({ from: { pathname: "/login" } })).toBeNull();
  });
});

describe("ssoErrorFromSearch", () => {
  it("reads a plain-language IdP error from the callback query", () => {
    expect(
      ssoErrorFromSearch("?sso_error=The+identity+provider+cancelled+sign-in."),
    ).toBe("The identity provider cancelled sign-in.");
  });

  it("returns null when the callback has no error", () => {
    expect(ssoErrorFromSearch("")).toBeNull();
    expect(ssoErrorFromSearch("?other=1")).toBeNull();
  });
});

describe("loginDestinationForPersona", () => {
  it("sends Arjun to assets by default", () => {
    expect(loginDestinationForPersona("arjun", undefined)).toBe("/assets");
  });

  it("ignores campaign deep link for Arjun", () => {
    expect(
      loginDestinationForPersona("arjun", {
        pathname: "/campaign/abc",
        search: "",
        hash: "",
        state: null,
        key: "test",
      }),
    ).toBe("/assets");
  });

  it("honours asset deep link for Arjun", () => {
    expect(
      loginDestinationForPersona("arjun", {
        pathname: "/assets/xyz",
        search: "",
        hash: "",
        state: null,
        key: "test",
      }),
    ).toBe("/assets/xyz");
  });

  it("resolves campaign for Meera when from is root", () => {
    expect(
      loginDestinationForPersona("meera", {
        pathname: "/",
        search: "",
        hash: "",
        state: null,
        key: "test",
      }),
    ).toBe("resolve-campaign");
  });
});
