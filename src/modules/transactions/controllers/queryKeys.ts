/** Centralised query keys for the transactions module. */
export const TRANSACTIONS_QUERY_KEYS = {
  all: ["transactions"] as const,
  list: (params?: Record<string, unknown>) =>
    ["transactions", "list", params ?? {}] as const,
  detail: (id: string) => ["transactions", "detail", id] as const,
};
