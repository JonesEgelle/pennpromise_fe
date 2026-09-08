/** Centralised query keys for the auth module. Every module owns one of these. */
export const AUTH_QUERY_KEYS = {
  currentUser: ["auth", "current-user"] as const,
};
