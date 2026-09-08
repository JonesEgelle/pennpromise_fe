/**
 * Settings module types — from docs/dossiers/settings.md.
 *
 * TODO(api-contract): Security + Roles & Permissions inferred from Figma;
 * Notifications / User Management / System Configuration pending design.
 */

/* ---- Roles & Permissions ---- */

export type RoleMfa = "mandatory" | "optional";

export type PermissionColumn =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "export";

export interface PermissionRow {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  shariaMfa: RoleMfa;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  mfa: RoleMfa;
  /** Optimistic-locking token echoed back on a matrix save. */
  version: number;
}

export interface RoleDetail extends Role {
  matrix: PermissionRow[];
}

export type ChangeLogKind =
  | "matrix_update"
  | "role_created"
  | "unauthorized_access";

export interface ChangeLogEntry {
  id: string;
  at: string;
  title: string;
  detail: string;
  kind: ChangeLogKind;
}

export interface RolesStats {
  totalRoles: number;
  ethicalPermissions: number;
  mfaEnforced: number;
  auditFrequency: string;
}

/* ---- Security ---- */

export interface TfaSetup {
  secretKey: string;
  otpauthUrl: string;
}

/* ---- Notifications ---- */

export interface NotificationPrefs {
  email: boolean;
  phone: boolean;
  inApp: boolean;
}

/* ---- User Management (admin-console operators) ---- */

export type AdminUserRole =
  | "Super Admin"
  | "Administrator"
  | "Compliance Officer"
  | "Support Staff"
  | "Analyst";

export type AdminUserStatus = "active" | "suspended" | "invited";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  department: string;
  lastLoginAt: string | null;
  status: AdminUserStatus;
  /** True for the acting operator — cannot be removed/demoted (self-action). */
  isSelf: boolean;
}

/* ---- System Configuration ---- */

export interface SystemGeneralConfig {
  organisationName: string;
  timezone: string;
  baseCurrency: string;
}

export interface SystemNotificationToggle {
  key: string;
  label: string;
  enabled: boolean;
}

export interface EthicalFeatureFlag {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface AdvisoryChange {
  id: string;
  authorizedUser: string;
  adjustment: string;
  previousStatus: string;
  newStatus: string;
  at: string;
}

export interface SystemConfig {
  general: SystemGeneralConfig;
  notifications: SystemNotificationToggle[];
  featureFlags: EthicalFeatureFlag[];
  advisoryChanges: AdvisoryChange[];
}
