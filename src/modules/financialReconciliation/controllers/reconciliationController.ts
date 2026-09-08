"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { FIN_RECON_QUERY_KEYS } from "@/modules/financialReconciliation/controllers/queryKeys";
import {
  mockReconLedger,
  mockReconOverview,
  mockResolveFlag,
  mockSkipFlag,
} from "@/modules/financialReconciliation/lib/mock-data";
import type { ReconResolutionReason } from "@/modules/financialReconciliation/types";

// TODO(api-contract): swap `mock*` for `services/financial-reconciliation.ts`.

export function useReconOverview() {
  return useQuery({
    queryKey: FIN_RECON_QUERY_KEYS.overview,
    queryFn: mockReconOverview,
  });
}

export function useReconLedger(flagId: string | null) {
  return useQuery({
    queryKey: FIN_RECON_QUERY_KEYS.ledger(flagId ?? "none"),
    queryFn: () => mockReconLedger(),
    enabled: Boolean(flagId),
  });
}

export function useResolveFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      flagId: string;
      reason: ReconResolutionReason;
    }) => mockResolveFlag(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FIN_RECON_QUERY_KEYS.all });
      toast.success("Match approved.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not resolve the flag.")),
  });
}

export function useSkipFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (flagId: string) => mockSkipFlag(flagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FIN_RECON_QUERY_KEYS.all });
      toast.success("Flag deferred.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not skip the flag.")),
  });
}
