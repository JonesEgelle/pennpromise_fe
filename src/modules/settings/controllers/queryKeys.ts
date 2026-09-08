/** Centralised query keys for the settings module. */
export const SETTINGS_QUERY_KEYS = {
  all: ["settings"] as const,
  roles: ["settings", "roles"] as const,
  roleMatrix: (id: string) => ["settings", "role-matrix", id] as const,
  changeLog: ["settings", "change-log"] as const,
  rolesStats: ["settings", "roles-stats"] as const,
  tfaSetup: ["settings", "tfa-setup"] as const,
  notifications: ["settings", "notifications"] as const,
  systemConfig: ["settings", "system-config"] as const,
  adminUsers: (params?: Record<string, unknown>) =>
    ["settings", "admin-users", params ?? {}] as const,
};
