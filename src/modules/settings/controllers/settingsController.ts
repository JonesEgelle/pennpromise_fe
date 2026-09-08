"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { SETTINGS_QUERY_KEYS } from "@/modules/settings/controllers/queryKeys";
import {
  mockChangeLog,
  mockCreateAdminUser,
  mockCreateRole,
  mockDeleteAdminUser,
  mockListAdminUsers,
  mockNotificationPrefs,
  mockRoleDetail,
  mockRoles,
  mockRolesStats,
  mockSaveNotificationPrefs,
  mockSaveRoleMatrix,
  mockSaveSystemConfig,
  mockSecurityMutation,
  mockSystemConfig,
  mockTfaSetup,
  mockUpdateAdminUser,
  type AdminUserInput,
} from "@/modules/settings/lib/mock-data";
import type {
  AdminUser,
  NotificationPrefs,
  PermissionRow,
  SystemConfig,
} from "@/modules/settings/types";

// TODO(api-contract): swap `mock*` for `services/settings.ts` over `apiClient`.
// Real password / passcode / TFA flows are backend-only.

export function useRoles() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.roles,
    queryFn: mockRoles,
  });
}

export function useRoleMatrix(roleId: string | null) {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.roleMatrix(roleId ?? "none"),
    queryFn: () => mockRoleDetail(roleId as string),
    enabled: Boolean(roleId),
  });
}

export function useRolesChangeLog() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.changeLog,
    queryFn: mockChangeLog,
  });
}

export function useRolesStats() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.rolesStats,
    queryFn: mockRolesStats,
  });
}

export function useTfaSetup() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.tfaSetup,
    queryFn: mockTfaSetup,
  });
}

function invalidateRoles(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.all });
}

export function useSaveRoleMatrix() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      id: string;
      matrix: PermissionRow[];
      version: number;
    }) => mockSaveRoleMatrix(input),
    onSuccess: () => {
      invalidateRoles(queryClient);
      toast.success("Permissions saved.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not save permissions.")),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; description: string }) =>
      mockCreateRole(input),
    onSuccess: () => {
      invalidateRoles(queryClient);
      toast.success("Role created.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not create the role.")),
  });
}

export function useSecurityMutation(successMessage: string) {
  return useMutation({
    mutationFn: () => mockSecurityMutation(),
    onSuccess: () => toast.success(successMessage),
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Something went wrong.")),
  });
}

/* ---- Notifications ---- */

export function useNotificationPrefs() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.notifications,
    queryFn: mockNotificationPrefs,
  });
}

export function useSaveNotificationPrefs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (next: NotificationPrefs) => mockSaveNotificationPrefs(next),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SETTINGS_QUERY_KEYS.notifications,
      });
      toast.success("Notification preferences saved.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not save preferences.")),
  });
}

/* ---- User Management ---- */

export function useAdminUsers(params: {
  page: number;
  pageSize: number;
  search: string;
  status: AdminUser["status"] | "all";
}) {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.adminUsers(params),
    queryFn: () => mockListAdminUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminUserInput) => mockCreateAdminUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.all });
      toast.success("Operator added.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not add the operator.")),
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AdminUserInput }) =>
      mockUpdateAdminUser(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.all });
      toast.success("Operator updated.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not update the operator.")),
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockDeleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.all });
      toast.success("Operator removed.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not remove the operator.")),
  });
}

/* ---- System Configuration ---- */

export function useSystemConfig() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.systemConfig,
    queryFn: mockSystemConfig,
  });
}

export function useSaveSystemConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (next: SystemConfig) => mockSaveSystemConfig(next),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SETTINGS_QUERY_KEYS.systemConfig,
      });
      toast.success("System configuration saved.");
    },
    onError: (error) =>
      toast.error(getApiErrorMessage(error, "Could not save configuration.")),
  });
}
