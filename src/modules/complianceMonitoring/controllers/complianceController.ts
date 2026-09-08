"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { COMPLIANCE_QUERY_KEYS } from "@/modules/complianceMonitoring/controllers/queryKeys";
import { COMPLIANCE_OVERVIEW_MOCK } from "@/modules/complianceMonitoring/lib/mock-data";

// TODO(api-contract): swap for `services/compliance-monitoring.ts` over apiClient.

export function useComplianceOverview() {
  return useQuery({
    queryKey: COMPLIANCE_QUERY_KEYS.overview,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return COMPLIANCE_OVERVIEW_MOCK;
    },
  });
}

/** Stub jobs — Generate Fatwa Certificate / Run Sharia Integrity Check. */
export function useComplianceJob(successMessage: string) {
  return useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    },
    onSuccess: () => toast.success(successMessage),
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "The job could not be started.")),
  });
}
