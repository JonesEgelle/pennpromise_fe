import type { KycQueueParams } from "@/modules/kyc/types";

/**
 * Centralised query keys for the kyc module. The queue is a derived
 * latest-of-list; detail + audit log are separate keys so a decision can
 * invalidate all three.
 */
export const KYC_QUERY_KEYS = {
  all: ["kyc"] as const,
  queue: (params: KycQueueParams) => ["kyc", "queue", params] as const,
  detail: (id: string) => ["kyc", "detail", id] as const,
  auditLog: (id: string) => ["kyc", "audit-log", id] as const,
};
