import { AxiosError } from "axios";

import type { IResponse } from "@/types/http";

/**
 * One shared way to pull a human-readable message out of any thrown error.
 * Every mutation's `onError` should use this so error toasts are consistent.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Partial<IResponse> | undefined;
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
