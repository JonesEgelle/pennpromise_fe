import { z } from "zod";

/**
 * Member create / edit schema. Form types are `z.infer` outputs — never a
 * hand-written parallel interface (CLAUDE.md).
 */
export const memberFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  certification: z.enum([
    "not_certified",
    "review_pending",
    "sharia_certified",
  ]),
  status: z.enum(["halal_active", "dormant", "suspended"]),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;

export const MEMBER_CERTIFICATION_OPTIONS = [
  { value: "not_certified", label: "Not Certified" },
  { value: "review_pending", label: "Review Pending" },
  { value: "sharia_certified", label: "Sharia Certified" },
] as const;

export const MEMBER_STATUS_OPTIONS = [
  { value: "halal_active", label: "Halal Active" },
  { value: "dormant", label: "Dormant" },
  { value: "suspended", label: "Suspended" },
] as const;
