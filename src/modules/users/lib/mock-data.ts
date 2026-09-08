/**
 * In-memory Users store + async adapter.
 *
 * TODO(api-contract): replace each `mock*` fn body with a `services/users.ts`
 * call over `apiClient` once the backend contract is confirmed
 * (`npm run sync:schema`). Signatures already match server-side semantics
 * (paged/filtered list, single-record detail, CRUD) so callers don't change.
 */
import type {
  Member,
  MemberCertification,
  MemberDetail,
  MemberListParams,
  MemberListResult,
  MemberStatus,
} from "@/modules/users/types";

const FIRST_NAMES = [
  "Zainab",
  "Ahmad",
  "Aisha",
  "Ibrahim",
  "Usman",
  "Fatima",
  "Yusuf",
  "Hauwa",
  "Sani",
  "Maryam",
  "Bello",
  "Amina",
  "Musa",
  "Halima",
  "Idris",
];
const LAST_NAMES = [
  "Bello",
  "Ibrahim",
  "Farouk",
  "Balarabe",
  "Muhammad",
  "Yusuf",
  "Abdullahi",
  "Sani",
  "Danjuma",
  "Okeke",
  "Adeyemi",
  "Lawal",
];
const LOCATIONS = ["Kano, Nigeria", "Kaduna, Nigeria", "Lagos, Nigeria", "Abuja, Nigeria"];
const PROFESSIONS = ["Creative Artist", "Trader", "Engineer", "Civil Servant", "Entrepreneur"];
const CERTS: MemberCertification[] = [
  "sharia_certified",
  "review_pending",
  "sharia_certified",
  "not_certified",
];
const STATUSES: MemberStatus[] = [
  "halal_active",
  "halal_active",
  "halal_active",
  "dormant",
  "suspended",
];

function seed(): Member[] {
  return Array.from({ length: 47 }, (_, index) => {
    const first = FIRST_NAMES[index % FIRST_NAMES.length];
    const last = LAST_NAMES[index % LAST_NAMES.length];
    return {
      memberId: `NG-${(22041 + index).toString()}`,
      firstName: first,
      lastName: last,
      email: `${first}.${last}`.toLowerCase() + "@example.ng",
      phone: `+234706${(7421332 + index * 7).toString().slice(0, 7)}`,
      location: LOCATIONS[index % LOCATIONS.length],
      dateOfBirth: "1992-10-19",
      gender: index % 2 === 0 ? "Male" : "Female",
      maritalStatus: index % 3 === 0 ? "Married" : "Single",
      profession: PROFESSIONS[index % PROFESSIONS.length],
      memberSince: "2023-10-12",
      lastLoginAt: `2025-03-${String((index % 27) + 1).padStart(2, "0")}T09:15:00+01:00`,
      certification: CERTS[index % CERTS.length],
      status: STATUSES[index % STATUSES.length],
      updatedAt: "2026-09-01T10:00:00+01:00",
    };
  });
}

let store: Member[] = seed();

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

function detailFor(member: Member): MemberDetail {
  return {
    ...member,
    halalAssets: {
      totalUsd: 125_738.25,
      benchmarkUsd: 12_000_000,
      benchmarkDeltaPct: 1.15,
      equityNgn: 840_000,
      bondsNgn: 400_500,
    },
    complianceHistory: [
      {
        id: "h1",
        label: "Fatwa Board approved Sukuk investment eligibility",
        at: "2024-05-18T14:32:00+01:00",
        tone: "success",
      },
      {
        id: "h2",
        label: "Completed Sharia-compliance onboarding",
        at: "2024-05-17T09:15:00+01:00",
        tone: "info",
      },
      {
        id: "h3",
        label: "Updated Real Estate payment preferences",
        at: "2024-05-12T16:44:00+01:00",
        tone: "muted",
      },
    ],
    complianceActions: [
      { id: "a1", label: "Renew certification", kind: "renew_certification" },
      { id: "a2", label: "Audit Portfolio (Halal)", kind: "audit_portfolio" },
      { id: "a3", label: "Review Account", kind: "review_account" },
      { id: "a4", label: "Restrict Access", kind: "restrict_access" },
    ],
  };
}

export async function mockListMembers(
  params: MemberListParams,
): Promise<MemberListResult> {
  await delay();
  const search = params.search.trim().toLowerCase();
  const filtered = store.filter((member) => {
    if (params.status !== "all" && member.status !== params.status) return false;
    if (
      params.certification !== "all" &&
      member.certification !== params.certification
    ) {
      return false;
    }
    if (!search) return true;
    return (
      member.memberId.toLowerCase().includes(search) ||
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search)
    );
  });

  const count = filtered.length;
  const totalPages = Math.max(1, Math.ceil(count / params.pageSize));
  const page = Math.min(Math.max(1, params.page), totalPages);
  const start = (page - 1) * params.pageSize;

  return {
    results: filtered.slice(start, start + params.pageSize),
    pagination: {
      count,
      page,
      page_size: params.pageSize,
      total_pages: totalPages,
    },
  };
}

export async function mockGetMember(memberId: string): Promise<MemberDetail> {
  await delay(200);
  const member = store.find((entry) => entry.memberId === memberId);
  if (!member) throw new Error("This member no longer exists.");
  return detailFor(member);
}

export interface MemberInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  certification: MemberCertification;
  status: MemberStatus;
}

export async function mockCreateMember(input: MemberInput): Promise<Member> {
  await delay();
  const nextId = `NG-${(22041 + store.length).toString()}`;
  const member: Member = {
    memberId: nextId,
    ...input,
    lastLoginAt: null,
    updatedAt: new Date().toISOString(),
  };
  store = [member, ...store];
  return member;
}

export async function mockUpdateMember(
  memberId: string,
  input: Partial<MemberInput>,
): Promise<Member> {
  await delay();
  let updated: Member | undefined;
  store = store.map((entry) => {
    if (entry.memberId !== memberId) return entry;
    updated = { ...entry, ...input, updatedAt: new Date().toISOString() };
    return updated;
  });
  if (!updated) throw new Error("This member no longer exists.");
  return updated;
}

export async function mockDeleteMember(memberId: string): Promise<void> {
  await delay();
  store = store.filter((entry) => entry.memberId !== memberId);
}
