/**
 * Token + session helpers. PennPromise uses a single token source of truth:
 * the access token in `localStorage`. This deliberately avoids dgtool_fe's
 * dual NextAuth-session + localStorage storage, which only existed there to
 * paper over a login race condition (see CLAUDE.md "Deltas from dgtool_fe").
 */

export const ACCESS_TOKEN_KEY = "pp_access_token";
export const REFRESH_TOKEN_KEY = "pp_refresh_token";

/**
 * DEV-ONLY escape hatch. When `NEXT_PUBLIC_DISABLE_AUTH=true`, the client
 * `AuthGuard` and `SessionMonitor` are bypassed so the whole authenticated app
 * is reachable without a backend login — the UI is being built against mock
 * data with no endpoints wired yet. Remove the env var (or set it to `false`)
 * to restore the real flow. The backend still rejects unauthorised API calls;
 * this only relaxes the client gate.
 */
export const AUTH_DISABLED =
  process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";

if (AUTH_DISABLED && process.env.NODE_ENV !== "test") {
  console.warn(
    "[auth] NEXT_PUBLIC_DISABLE_AUTH is on — client auth guard is bypassed. " +
      "Do not ship this to production.",
  );
}

const isBrowser = () => typeof window !== "undefined";

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthTokens(accessToken: string, refreshToken?: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch {
    /* storage unavailable — nothing we can do */
  }
}

export function clearAuthTokens(): void {
  if (!isBrowser()) return;
  try {
    const keysToClear: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key) continue;
      if (/auth|token|session/i.test(key)) keysToClear.push(key);
    }
    keysToClear.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    /* storage unavailable */
  }
}

/**
 * Decode a JWT's `exp` claim client-side (no signature check — that's the
 * backend's job) with a 5s clock-skew buffer. Opaque / non-JWT tokens are
 * treated as NOT expired and left for the backend's 401 to catch.
 */
export function isSessionExpired(token: string | null): boolean {
  if (!token) return true;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    const skewSeconds = 5;
    return payload.exp - skewSeconds <= Date.now() / 1000;
  } catch {
    return false;
  }
}

/**
 * Called on a 401 or a detected expiry: wipe local auth state and hard-redirect
 * to sign-in. A full document navigation (not a router push) guarantees every
 * in-memory cache is dropped.
 */
export function handleSessionExpiry(): void {
  clearAuthTokens();
  if (isBrowser() && !window.location.pathname.startsWith("/auth")) {
    // Hard document navigation (not a router push) is deliberate: it guarantees
    // every in-memory cache — query cache, form state — is dropped on sign-out.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/auth/signin";
  }
}

/** Explicit user-initiated logout. Same teardown as an expiry. */
export function performLogout(): void {
  clearAuthTokens();
  if (isBrowser()) {
    // See handleSessionExpiry — a full reload is the intended reset.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/auth/signin";
  }
}
