/** Centralised query keys for the users module. Every module owns one of these. */
export const USERS_QUERY_KEYS = {
  all: ["users"] as const,
  list: (params?: Record<string, unknown>) =>
    ["users", "list", params ?? {}] as const,
  detail: (id: string) => ["users", "detail", id] as const,
};
