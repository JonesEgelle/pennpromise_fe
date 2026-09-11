import apiClient from "@/lib/api-client";
import { AUTH_API_ROUTES } from "@/constants/auth-api-routes";
import { AUTH_DISABLED } from "@/lib/auth-utils";
import type { IResponse } from "@/types/http";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponseData,
  ResetPasswordRequest,
  VerifyOtpRequest,
  VerifyOtpResponseData,
} from "@/modules/auth/types";

/**
 * Thin wrapper over the single apiClient — one method per operation, returns the
 * unwrapped envelope (`response.data`). Controllers add TanStack Query + toasts.
 *
 * DEV-ONLY: while `NEXT_PUBLIC_DISABLE_AUTH=true` (no backend endpoints exist
 * yet), every method below short-circuits to a fake success response instead of
 * calling `apiClient`, so the whole auth flow — sign in, forgot password, OTP,
 * reset — is clickable end-to-end against mock data. Once real endpoints ship,
 * unset the env var and these methods fall straight through to the real calls
 * below with nothing else to change.
 */

/** Simulated network latency so mutation loading states stay visible. */
const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 600));

export const authService = {
  async login(payload: LoginRequest): Promise<IResponse<LoginResponseData>> {
    if (AUTH_DISABLED) {
      await mockDelay();
      return {
        status: true,
        message: "Signed in (mock — no backend yet).",
        data: {
          access_token: "mock-access-token",
          refresh_token: "mock-refresh-token",
          user: { id: "mock-user-1", email: payload.email },
        },
      };
    }
    const response = await apiClient.post<IResponse<LoginResponseData>>(
      AUTH_API_ROUTES.LOGIN,
      payload,
    );
    return response.data;
  },

  async forgotPassword(
    payload: ForgotPasswordRequest,
  ): Promise<IResponse<null>> {
    if (AUTH_DISABLED) {
      await mockDelay();
      return {
        status: true,
        message: `Mock code sent to ${payload.email}.`,
        data: null,
      };
    }
    const response = await apiClient.post<IResponse<null>>(
      AUTH_API_ROUTES.FORGOT_PASSWORD,
      payload,
    );
    return response.data;
  },

  async verifyOtp(
    payload: VerifyOtpRequest,
  ): Promise<IResponse<VerifyOtpResponseData>> {
    if (AUTH_DISABLED) {
      await mockDelay();
      return {
        status: true,
        message: "Code verified (mock).",
        data: { reset_token: "mock-reset-token" },
      };
    }
    const response = await apiClient.post<IResponse<VerifyOtpResponseData>>(
      AUTH_API_ROUTES.VERIFY_OTP,
      payload,
    );
    return response.data;
  },

  async resendOtp(payload: ForgotPasswordRequest): Promise<IResponse<null>> {
    if (AUTH_DISABLED) {
      await mockDelay();
      return {
        status: true,
        message: `Mock code resent to ${payload.email}.`,
        data: null,
      };
    }
    const response = await apiClient.post<IResponse<null>>(
      AUTH_API_ROUTES.RESEND_OTP,
      payload,
    );
    return response.data;
  },

  async resetPassword(
    payload: ResetPasswordRequest,
  ): Promise<IResponse<null>> {
    if (AUTH_DISABLED) {
      await mockDelay();
      return {
        status: true,
        message: "Password updated (mock). Please sign in.",
        data: null,
      };
    }
    const response = await apiClient.post<IResponse<null>>(
      AUTH_API_ROUTES.RESET_PASSWORD,
      payload,
    );
    return response.data;
  },
};
