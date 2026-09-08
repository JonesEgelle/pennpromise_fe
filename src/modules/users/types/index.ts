/**
 * Users module types — the entities from docs/dossiers/users.md.
 *
 * TODO(api-contract): inferred from the Figma design. Validate against the real
 * backend (`npm run sync:schema`) before wiring services. These records are
 * platform MEMBERS, not admin-console operators (those live under
 * Settings → User Management).
 */
import type { PaginatedData } from "@/types/http";

export type MemberCertification =
  | "not_certified"
  | "review_pending"
  | "sharia_certified";

export type MemberStatus = "halal_active" | "dormant" | "suspended";

export interface Member {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  profession?: string;
  memberSince?: string;
  lastLoginAt: string | null;
  certification: MemberCertification;
  status: MemberStatus;
  /** Last write the UI saw — sent back on certification/status writes. */
  updatedAt: string;
}

export interface MemberComplianceEntry {
  id: string;
  label: string;
  at: string;
  tone: "success" | "info" | "muted";
}

export type MemberComplianceActionKind =
  | "renew_certification"
  | "audit_portfolio"
  | "review_account"
  | "restrict_access";

export interface MemberComplianceAction {
  id: string;
  label: string;
  kind: MemberComplianceActionKind;
}

export interface MemberHalalAssets {
  totalUsd: number;
  benchmarkUsd: number;
  benchmarkDeltaPct: number;
  equityNgn: number;
  bondsNgn: number;
}

export interface MemberDetail extends Member {
  halalAssets: MemberHalalAssets;
  complianceHistory: MemberComplianceEntry[];
  complianceActions: MemberComplianceAction[];
}

/** Type alias (not interface) so it satisfies the `Record<string, unknown>`
 *  query-key param without a cast. */
export type MemberListParams = {
  page: number;
  pageSize: number;
  search: string;
  status: MemberStatus | "all";
  certification: MemberCertification | "all";
};

export type MemberListResult = PaginatedData<Member>;
