/** In-app route paths. Import these instead of writing string literals. */

export const AUTH_ROUTES = {
  SIGN_IN: "/auth/signin",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_OTP: "/auth/verify-otp",
  RESET_PASSWORD: "/auth/reset-password",
} as const;

export const APP_ROUTES = {
  USERS: "/users",
  KYC: "/kyc",
  TRANSACTIONS: "/transactions",
  FINANCIAL_RECONCILIATION: "/financial-reconciliation",
  COMPLIANCE_MONITORING: "/compliance-monitoring",
  PLATFORM_ANALYTICS: "/platform-analytics",
  SYSTEM_HEALTH: "/system-health",
  AUDIT_TRAIL: "/audit-trail",
  SETTINGS: "/settings",
} as const;

export const SETTINGS_TABS = {
  SECURITY: "security",
  NOTIFICATIONS: "notifications",
  USER_MANAGEMENT: "user-management",
  ROLES_PERMISSIONS: "roles-permissions",
  SYSTEM_CONFIGURATION: "system-configuration",
} as const;
