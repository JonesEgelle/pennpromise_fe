"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { USERS_QUERY_KEYS } from "@/modules/users/controllers/queryKeys";
import {
  mockCreateMember,
  mockDeleteMember,
  mockGetMember,
  mockListMembers,
  mockUpdateMember,
  type MemberInput,
} from "@/modules/users/lib/mock-data";
import type { MemberListParams } from "@/modules/users/types";

// TODO(api-contract): swap the `mock*` calls for `services/users.ts` over
// `apiClient` once the backend contract is confirmed. Hooks below already model
// server-side list params + the mutation → invalidate + toast contract.

export function useMembers(params: MemberListParams) {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.list(params),
    queryFn: () => mockListMembers(params),
    placeholderData: keepPreviousData,
  });
}

export function useMember(memberId: string | null) {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.detail(memberId ?? "none"),
    queryFn: () => mockGetMember(memberId as string),
    enabled: Boolean(memberId),
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: MemberInput) => mockCreateMember(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
      toast.success("Member created.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not create the member.")),
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      memberId,
      input,
    }: {
      memberId: string;
      input: Partial<MemberInput>;
    }) => mockUpdateMember(memberId, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: USERS_QUERY_KEYS.detail(variables.memberId),
      });
      toast.success("Member updated.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not update the member.")),
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => mockDeleteMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
      toast.success("Member removed.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not remove the member.")),
  });
}
