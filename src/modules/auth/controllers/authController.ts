"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error";
import { setAuthTokens } from "@/lib/auth-utils";
import { authService } from "@/services/auth";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from "@/modules/auth/types";

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: (response) => {
      const { access_token, refresh_token } = response.data;
      setAuthTokens(access_token, refresh_token);
      toast.success(response.message || "Signed in.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not sign you in."));
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) =>
      authService.forgotPassword(payload),
    onSuccess: (response) => {
      toast.success(response.message || "We sent you a reset code.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not send a reset code."));
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) =>
      authService.resendOtp(payload),
    onSuccess: (response) => {
      toast.success(response.message || "A new code is on its way.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not resend the code."));
    },
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => authService.verifyOtp(payload),
    onSuccess: (response) => {
      toast.success(response.message || "Code verified.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "That code did not work."));
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) =>
      authService.resetPassword(payload),
    onSuccess: (response) => {
      toast.success(response.message || "Password updated. Please sign in.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Could not reset your password."));
    },
  });
}
