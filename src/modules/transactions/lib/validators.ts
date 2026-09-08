import { z } from "zod";

/**
 * Transaction create / edit schema. Amount stays a string in form state and is
 * parsed to a number only at the API-call boundary (CLAUDE.md).
 */
export const transactionFormSchema = z.object({
  contractId: z.string().trim().min(1, "Contract ID is required"),
  clientName: z.string().trim().min(1, "Client name is required"),
  bvnMasked: z.string().trim().min(1, "Client BVN is required"),
  product: z.enum(["bonds", "sukuk", "equity", "murabaha", "ijarah"]),
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, {
      message: "Enter a valid amount",
    }),
  compliance: z.enum(["cleared", "flagged", "under_review", "blocked"]),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const PRODUCT_OPTIONS = [
  { value: "bonds", label: "Bonds" },
  { value: "sukuk", label: "Sukuk" },
  { value: "equity", label: "Equity" },
  { value: "murabaha", label: "Murabaha" },
  { value: "ijarah", label: "Ijarah" },
] as const;

export const COMPLIANCE_OPTIONS = [
  { value: "cleared", label: "Cleared" },
  { value: "flagged", label: "Flagged" },
  { value: "under_review", label: "Under Review" },
  { value: "blocked", label: "Blocked" },
] as const;

export const DATE_RANGE_OPTIONS = [
  { value: "last_24_hours", label: "Last 24 Hours" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "last_90_days", label: "Last 90 Days" },
  { value: "all_time", label: "All Time" },
] as const;
