/**
 * Auth request/response types.
 * TODO(api-contract): response shapes are inferred — confirm against the real
 * backend before relying on field names.
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token?: string;
  user: AuthUser;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponseData {
  /** Short-lived token proving OTP ownership, passed to the reset call. */
  reset_token: string;
}

export interface ResetPasswordRequest {
  email: string;
  reset_token: string;
  password: string;
}
