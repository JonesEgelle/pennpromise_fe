import apiClient from "@/lib/api-client";
import { AUTH_API_ROUTES } from "@/constants/auth-api-routes";
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
 */
export const authService = {
  async login(payload: LoginRequest): Promise<IResponse<LoginResponseData>> {
    const response = await apiClient.post<IResponse<LoginResponseData>>(
      AUTH_API_ROUTES.LOGIN,
      payload,
    );
    return response.data;
  },

  async forgotPassword(
    payload: ForgotPasswordRequest,
  ): Promise<IResponse<null>> {
    const response = await apiClient.post<IResponse<null>>(
      AUTH_API_ROUTES.FORGOT_PASSWORD,
      payload,
    );
    return response.data;
  },

  async verifyOtp(
    payload: VerifyOtpRequest,
  ): Promise<IResponse<VerifyOtpResponseData>> {
    const response = await apiClient.post<IResponse<VerifyOtpResponseData>>(
      AUTH_API_ROUTES.VERIFY_OTP,
      payload,
    );
    return response.data;
  },

  async resendOtp(
    payload: ForgotPasswordRequest,
  ): Promise<IResponse<null>> {
    const response = await apiClient.post<IResponse<null>>(
      AUTH_API_ROUTES.RESEND_OTP,
      payload,
    );
    return response.data;
  },

  async resetPassword(
    payload: ResetPasswordRequest,
  ): Promise<IResponse<null>> {
    const response = await apiClient.post<IResponse<null>>(
      AUTH_API_ROUTES.RESET_PASSWORD,
      payload,
    );
    return response.data;
  },
};
