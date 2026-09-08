"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { AUDIT_TRAIL_QUERY_KEYS } from "@/modules/auditTrail/controllers/queryKeys";
import {
  mockAuditList,
  mockAuditStats,
} from "@/modules/auditTrail/lib/mock-data";
import type { AuditListParams } from "@/modules/auditTrail/types";

// TODO(api-contract): swap `mock*` for `services/audit-trail.ts` over `apiClient`.

export function useAuditList(params: AuditListParams) {
  return useQuery({
    queryKey: AUDIT_TRAIL_QUERY_KEYS.list(params),
    queryFn: () => mockAuditList(params),
    placeholderData: keepPreviousData,
  });
}

export function useAuditStats() {
  return useQuery({
    queryKey: AUDIT_TRAIL_QUERY_KEYS.stats,
    queryFn: mockAuditStats,
  });
}
