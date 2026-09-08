/**
 * Transactions module types — from the "Transaction Monitoring" screen.
 *
 * TODO(api-contract): inferred from Figma. Validate against the backend
 * (`npm run sync:schema`). Financial transactions are normally immutable /
 * append-only — see the dossier; "edit" here is expected to mean amend
 * compliance state + annotate, "delete" to mean void.
 */
import type { PaginatedData } from "@/types/http";

export type TransactionProduct =
  | "bonds"
  | "sukuk"
  | "equity"
  | "murabaha"
  | "ijarah";

export type TransactionCompliance =
  | "cleared"
  | "flagged"
  | "under_review"
  | "blocked";

export type TransactionDateRange =
  | "last_24_hours"
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "all_time";

export interface TransactionClient {
  name: string;
  /** Masked at the source, e.g. "2221********918". */
  bvnMasked: string;
}

export interface Transaction {
  id: string;
  contractId: string;
  timestamp: string;
  client: TransactionClient;
  product: TransactionProduct;
  amountNgn: number;
  compliance: TransactionCompliance;
  updatedAt: string;
}

export type TransactionListParams = {
  page: number;
  pageSize: number;
  dateRange: TransactionDateRange;
  compliance: TransactionCompliance | "all";
  product: TransactionProduct | "all";
  client: string;
  amountMin: number | null;
  amountMax: number | null;
};

export type TransactionListResult = PaginatedData<Transaction>;
