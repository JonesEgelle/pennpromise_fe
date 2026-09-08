/**
 * System Health types — from docs/dossiers/systemHealth.md.
 * TODO(api-contract): validate against the backend.
 */

export interface NodeMetric {
  id: string;
  label: string;
  value: string;
  delta: number;
  bars: number[];
}

export type HubCellStatus = "ok" | "warn" | "error";

export interface HubStatusRow {
  product: string;
  statuses: Record<string, HubCellStatus>;
  uptimePct: number;
}

export type HealthAlertSeverity = "critical" | "warning" | "info";
export type HealthAlertAction = "acknowledge" | "dismiss" | "audit_status";

export interface HealthAlert {
  id: string;
  severity: HealthAlertSeverity;
  title: string;
  description: string;
  at: string;
  actions: HealthAlertAction[];
}

export interface LocalHealthGauge {
  label: string;
  percent: number;
  statusLabel: string;
  tone: "green" | "gold";
}

export interface SystemHealthData {
  lastSync: string;
  nodes: NodeMetric[];
  hubNodes: { key: string; label: string }[];
  hubRows: HubStatusRow[];
  hubFooter: {
    advisoryRespMs: number;
    advisoryDeltaMs: number;
    nonComplianceRiskPct: number;
    nonComplianceDeltaPct: number;
  };
  alerts: HealthAlert[];
  distribution: { hotspot: string; volume: string };
  localHealth: LocalHealthGauge[];
}
