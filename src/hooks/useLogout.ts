"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { performLogout } from "@/lib/auth-utils";

/**
 * Clears the query cache and local auth state, then hard-redirects to sign-in.
 * TODO(api-contract): also call the backend logout endpoint once confirmed.
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.clear();
    performLogout();
  }, [queryClient]);
}
