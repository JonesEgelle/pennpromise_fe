import { z } from "zod";

/**
 * Decision payload. A rejection requires a note for the record; an approval note
 * is optional (dossier → Rules).
 */
export const kycDecisionSchema = z
  .object({
    decision: z.enum(["approved", "rejected"]),
    notes: z.string().trim(),
  })
  .refine((value) => value.decision !== "rejected" || value.notes.length >= 3, {
    message: "A note is required to reject a case.",
    path: ["notes"],
  });

export type KycDecisionValues = z.infer<typeof kycDecisionSchema>;

export const KYC_PRIORITY_FILTER_OPTIONS = [
  { value: "all", label: "All priorities" },
  { value: "high_priority", label: "High priority" },
  { value: "standard", label: "Standard" },
] as const;
