/**
 * lib.test — mock credential matcher for Screen 0 demo accounts.
 */

import { describe, expect, it } from "vitest";

import {
  loginDestinationForPersona,
  matchMockCredentials,
} from "@/features/login/lib";

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

  it("rejects wrong password", () => {
    expect(
      matchMockCredentials("meera.menon@fundhouse.in", "wrong"),
    ).toBeNull();
  });

  it("rejects unknown user id", () => {
    expect(matchMockCredentials("unknown@fundhouse.in", "demo")).toBeNull();
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
