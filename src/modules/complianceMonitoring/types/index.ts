/**
 * Compliance Monitoring types — from docs/dossiers/complianceMonitoring.md.
 * TODO(api-contract): validate against the backend.
 */

export type ComplianceCardStatus =
  | "halal_verified"
  | "review_needed"
  | "optimal"
  | "attention";

export interface ComplianceStatusCard {
  id: string;
  title: string;
  description: string;
  status: ComplianceCardStatus;
  /** 0–100 underline bar. */
  progress: number;
}

export interface EthicalAlert {
  id: string;
  title: string;
  description: string;
  at: string;
  tags: string[];
  tone: "destructive" | "warning" | "info";
}

export interface GovernanceDoc {
  id: string;
  title: string;
  subtitle: string;
}

export interface EthicalLogEntry {
  id: string;
  title: string;
  description: string;
  at: string;
  refId: string;
}

export interface AlertsByTypeSlice {
  label: string;
  count: number;
  tone: "destructive" | "info" | "warning";
}

export interface ComplianceOverview {
  integrityScore: number;
  integrityDelta: number;
  integrityBars: number[];
  statusCards: ComplianceStatusCard[];
  alerts: EthicalAlert[];
  governanceDocs: GovernanceDoc[];
  ethicalLog: EthicalLogEntry[];
  alertsByType: AlertsByTypeSlice[];
  auditReadiness: { narrative: string };
}
