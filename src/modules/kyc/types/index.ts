/**
 * KYC / Compliance Queue types — entities from docs/dossiers/kyc.md.
 *
 * TODO(api-contract): inferred from Figma. Validate against the backend
 * (`npm run sync:schema`). Decisions are append-only / immutable; the queue is a
 * derived latest-of-list of `status = reviewing` cases.
 */

export type KycPriority = "high_priority" | "standard";
export type KycStatus = "reviewing" | "approved" | "rejected";

export interface KycCase {
  id: string;
  applicantName: string;
  applicantMemberId: string;
  tier: string;
  location: string;
  priority: KycPriority;
  status: KycStatus;
  /** ISO — drives the queue timer. */
  enqueuedAt: string;
  /** Short document tags shown as overlapping circles on the queue card. */
  documentBadges: string[];
}

export type KycDocumentKind = "nin" | "poa" | "bank" | "other";

export interface KycDocument {
  id: string;
  label: string;
  kind: KycDocumentKind;
  url: string;
}

export type AutoCheckStatus = "pending" | "passed" | "flagged" | "failed";

export interface KycAutoCheck {
  status: AutoCheckStatus;
  confidencePct: number;
  summary: string;
}

export type ChecklistKey =
  | "identity_ethics"
  | "bvn_haram_free"
  | "residency_zakat"
  | "pep_screening";

export interface KycChecklistItem {
  key: ChecklistKey;
  title: string;
  description: string;
  checked: boolean;
}

export interface KycAuditEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  note?: string;
}

export interface KycCaseDetail extends KycCase {
  application: string;
  nin: string;
  bvn: string;
  documents: KycDocument[];
  autoCheck: KycAutoCheck;
  checklist: KycChecklistItem[];
  notes: string;
  decidedBy?: string;
  decidedAt?: string;
  /** Optimistic-locking token echoed back on the decision write. */
  version: number;
}

export type KycQueueParams = {
  priority: KycPriority | "all";
  search: string;
};

export type KycDecision = "approved" | "rejected";

export interface KycDecisionInput {
  id: string;
  decision: KycDecision;
  notes: string;
  checklistKeys: ChecklistKey[];
  version: number;
}
