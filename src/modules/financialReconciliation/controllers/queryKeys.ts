/** Centralised query keys for the financialReconciliation module. */
export const FIN_RECON_QUERY_KEYS = {
  all: ["financial-reconciliation"] as const,
  overview: ["financial-reconciliation", "overview"] as const,
  ledger: (flagId: string) =>
    ["financial-reconciliation", "ledger", flagId] as const,
};
