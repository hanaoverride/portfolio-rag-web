import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getAuthToken } from "@/lib/hooks/useAuth";

vi.mock('@/lib/api/client', () => ({
  fetchApi: vi.fn(),
}));

describe("getAuthToken", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("returns null when no token is stored", () => {
    expect(getAuthToken()).toBeNull();
  });

  it("returns the stored token from localStorage", () => {
    const testToken = "test-auth-token-12345";
    localStorage.setItem("auth_token", testToken);
    expect(getAuthToken()).toBe(testToken);
  });

  it("returns null for different key", () => {
    localStorage.setItem("other_key", "some-token");
    expect(getAuthToken()).toBeNull();
  });

  it("updates when token changes", () => {
    expect(getAuthToken()).toBeNull();
    localStorage.setItem("auth_token", "first-token");
    expect(getAuthToken()).toBe("first-token");
    localStorage.setItem("auth_token", "second-token");
    expect(getAuthToken()).toBe("second-token");
  });
});

describe("logout", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("sends token in request body", async () => {
    const testToken = "test-logout-token-12345";
    localStorage.setItem("auth_token", testToken);

    const { fetchApi } = await import("@/lib/api/client");
    const { logout } = await import("@/lib/api/auth");

    await logout();

    expect(fetchApi).toHaveBeenCalledWith('/api/v1/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ token: testToken }),
    });
  });

  it("sends null when no token is stored", async () => {
    const { fetchApi } = await import("@/lib/api/client");
    const { logout } = await import("@/lib/api/auth");

    await logout();

    expect(fetchApi).toHaveBeenCalledWith('/api/v1/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ token: null }),
    });
  });
});