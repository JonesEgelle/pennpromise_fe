"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { TRANSACTIONS_QUERY_KEYS } from "@/modules/transactions/controllers/queryKeys";
import {
  mockCreateTransaction,
  mockDeleteTransaction,
  mockGetTransaction,
  mockListTransactions,
  mockUpdateTransaction,
  type TransactionInput,
} from "@/modules/transactions/lib/mock-data";
import type { TransactionListParams } from "@/modules/transactions/types";

// TODO(api-contract): swap the `mock*` calls for `services/transactions.ts` over
// `apiClient` once the backend contract is confirmed.

export function useTransactions(params: TransactionListParams) {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEYS.list(params),
    queryFn: () => mockListTransactions(params),
    placeholderData: keepPreviousData,
  });
}

export function useTransaction(id: string | null) {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEYS.detail(id ?? "none"),
    queryFn: () => mockGetTransaction(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TransactionInput) => mockCreateTransaction(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      toast.success("Transaction recorded.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not record the transaction.")),
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: TransactionInput;
    }) => mockUpdateTransaction(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      toast.success("Transaction updated.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not update the transaction.")),
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockDeleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEYS.all });
      toast.success("Transaction voided.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not void the transaction.")),
  });
}
