/** Centralised query keys for the auditTrail module. */
export const AUDIT_TRAIL_QUERY_KEYS = {
  all: ["audit-trail"] as const,
  list: (params?: Record<string, unknown>) =>
    ["audit-trail", "list", params ?? {}] as const,
  stats: ["audit-trail", "stats"] as const,
};
