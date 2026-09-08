"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { SYSTEM_HEALTH_QUERY_KEYS } from "@/modules/systemHealth/controllers/queryKeys";
import {
  mockClearAlerts,
  mockResolveAlert,
  mockSystemHealth,
} from "@/modules/systemHealth/lib/mock-data";

// TODO(api-contract): swap for `services/system-health.ts` over apiClient.

export function useSystemHealth() {
  return useQuery({
    queryKey: SYSTEM_HEALTH_QUERY_KEYS.overview,
    queryFn: mockSystemHealth,
  });
}

export function useResolveHealthAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockResolveAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SYSTEM_HEALTH_QUERY_KEYS.all });
      toast.success("Alert updated.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not update the alert.")),
  });
}

export function useClearHealthAlerts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => mockClearAlerts(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SYSTEM_HEALTH_QUERY_KEYS.all });
      toast.success("Alerts cleared.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not clear alerts.")),
  });
}
