"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { KYC_QUERY_KEYS } from "@/modules/kyc/controllers/queryKeys";
import {
  mockDecideKycCase,
  mockKycAuditLog,
  mockKycCase,
  mockKycQueue,
} from "@/modules/kyc/lib/mock-data";
import type { KycDecisionInput, KycQueueParams } from "@/modules/kyc/types";

// TODO(api-contract): swap the `mock*` calls for `services/kyc.ts` over
// `apiClient`. The decision mutation already sends `version` for optimistic
// locking and invalidates queue + detail + audit log.

export function useKycQueue(params: KycQueueParams) {
  return useQuery({
    queryKey: KYC_QUERY_KEYS.queue(params),
    queryFn: () => mockKycQueue(params),
    placeholderData: keepPreviousData,
  });
}

export function useKycCase(caseId: string | null) {
  return useQuery({
    queryKey: KYC_QUERY_KEYS.detail(caseId ?? "none"),
    queryFn: () => mockKycCase(caseId as string),
    enabled: Boolean(caseId),
  });
}

export function useKycAuditLog(caseId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: KYC_QUERY_KEYS.auditLog(caseId ?? "none"),
    queryFn: () => mockKycAuditLog(caseId as string),
    enabled: Boolean(caseId) && enabled,
  });
}

export function useDecideKycCase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: KycDecisionInput) => mockDecideKycCase(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: KYC_QUERY_KEYS.all });
      toast.success(
        variables.decision === "approved"
          ? "Case approved."
          : "Case rejected.",
      );
    },
    onError: (error) =>
      toast.error(
        getApiErrorMessage(error, "Could not record the decision."),
      ),
  });
}
