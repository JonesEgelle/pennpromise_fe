/**
 * Audit Trail types — from docs/dossiers/auditTrail.md. Entries are immutable /
 * append-only; this module never writes them.
 *
 * TODO(api-contract): validate against the backend (`npm run sync:schema`).
 */

export type AuditAction = "update" | "security_login" | "delete" | "create";

export interface AuditChange {
  field: string;
  old: string | null;
  new: string | null;
}

export interface AuditEntry {
  id: string;
  at: string;
  adminName: string;
  adminId: string;
  action: AuditAction;
  module: string;
  target: string;
  change: AuditChange | null;
  resourceType: string;
}

export type AuditListParams = {
  admin: string;
  action: AuditAction | "all";
  module: string;
  startDate: string;
  endDate: string;
  page: number;
  pageSize: number;
};

export interface AuditStats {
  logsTracked: number;
  nonComplianceAlerts: number;
  shariaCoveragePct: number;
  /** 7 columns (Mon–Sun) × 2 rows of 0–1 density values. */
  monitoringLoad: number[][];
}
