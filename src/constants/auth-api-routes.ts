/**
 * Auth endpoint paths.
 *
 * TODO(api-contract): these paths are INFERRED, not confirmed against the
 * PennPromise backend. Verify against the real OpenAPI spec before this flow
 * goes past local dev (see CLAUDE.md "Guardrails" → backend API contract).
 * Route values are builder-safe: use functions for anything with a path param,
 * never a literal `{id}` placeholder string.
 */

enum AUTH_API {
  BASE = "/auth",
}

export const AUTH_API_ROUTES = {
  LOGIN: `${AUTH_API.BASE}/login/`,
  LOGOUT: `${AUTH_API.BASE}/logout/`,
  REFRESH: `${AUTH_API.BASE}/token/refresh/`,
  FORGOT_PASSWORD: `${AUTH_API.BASE}/password/forgot/`,
  VERIFY_OTP: `${AUTH_API.BASE}/password/verify-otp/`,
  RESET_PASSWORD: `${AUTH_API.BASE}/password/reset/`,
  RESEND_OTP: `${AUTH_API.BASE}/password/resend-otp/`,
  ME: `${AUTH_API.BASE}/me/`,
} as const;
