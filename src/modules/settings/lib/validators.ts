import { z } from "zod";

/* ---- Security: password ---- */

export const PASSWORD_RULES: { label: string; test: (value: string) => boolean }[] =
  [
    { label: "At least 8 characters", test: (v) => v.length >= 8 },
    { label: "One lowercase character", test: (v) => /[a-z]/.test(v) },
    { label: "One uppercase character", test: (v) => /[A-Z]/.test(v) },
    { label: "A symbol or special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
  ];

export const passwordChangeSchema = z
  .object({
    oldPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .refine((v) => PASSWORD_RULES.every((rule) => rule.test(v)), {
        message: "Password does not meet all requirements",
      }),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password must differ from the current one",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;

/* ---- Security: passcode ---- */

const fourDigits = z
  .string()
  .regex(/^\d{4}$/, "Enter a 4-digit passcode");

export const passcodeChangeSchema = z
  .object({
    oldPasscode: fourDigits,
    newPasscode: fourDigits,
    confirmPasscode: fourDigits,
  })
  .refine((data) => data.newPasscode === data.confirmPasscode, {
    message: "Passcodes do not match",
    path: ["confirmPasscode"],
  });

export type PasscodeChangeValues = z.infer<typeof passcodeChangeSchema>;

/* ---- Security: TFA ---- */

export const tfaVerifySchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export type TfaVerifyValues = z.infer<typeof tfaVerifySchema>;

/* ---- Roles ---- */

export const createRoleSchema = z.object({
  name: z.string().trim().min(1, "Role name is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export type CreateRoleValues = z.infer<typeof createRoleSchema>;

/* ---- User Management ---- */

export const adminUserFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  role: z.enum([
    "Super Admin",
    "Administrator",
    "Compliance Officer",
    "Support Staff",
    "Analyst",
  ]),
  department: z.string().trim().min(1, "Department is required"),
  status: z.enum(["active", "suspended", "invited"]),
});

export type AdminUserFormValues = z.infer<typeof adminUserFormSchema>;

export const ADMIN_ROLE_OPTIONS = [
  { value: "Super Admin", label: "Super Admin" },
  { value: "Administrator", label: "Administrator" },
  { value: "Compliance Officer", label: "Compliance Officer" },
  { value: "Support Staff", label: "Support Staff" },
  { value: "Analyst", label: "Analyst" },
] as const;

export const ADMIN_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "invited", label: "Invited" },
] as const;
