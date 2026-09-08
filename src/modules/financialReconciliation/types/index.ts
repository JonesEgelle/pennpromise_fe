/**
 * Financial Reconciliation types — from docs/dossiers/financialReconciliation.md.
 * TODO(api-contract): validate against the backend (`npm run sync:schema`).
 */

export interface ReconStatTile {
  id: string;
  label: string;
  value: string;
  sub: string;
  delta: number | null;
  priority: boolean;
  /** 0–100 progress bar. */
  progress: number;
}

export type ReconFlagKind =
  | "coupon_mismatch"
  | "missing_log"
  | "duplicate_entry";

export interface ReconFlag {
  id: string;
  kind: ReconFlagKind;
  title: string;
  txnId: string;
  at: string;
  internalLabel: string;
  internalAmount: number | null;
  providerLabel: string;
  providerAmount: number | null;
  note?: string;
}

export interface ReconLedgerEntry {
  date: string;
  id: string;
  amount: number;
  mismatch: boolean;
}

export interface ReconLedger {
  internal: ReconLedgerEntry[];
  provider: ReconLedgerEntry[];
  providerName: string;
}

export type ReconResolutionReason =
  | "profit_sharing_adjustment"
  | "rounding_adjustment"
  | "currency_conversion"
  | "manual_write_off";

export interface ReconOverview {
  stats: ReconStatTile[];
  flags: ReconFlag[];
  periodLabel: string;
  flagsRemaining: number;
}
