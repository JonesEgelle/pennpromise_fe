/**
 * In-memory Compliance Queue store + async adapter.
 *
 * TODO(api-contract): replace each `mock*` body with a `services/kyc.ts` call
 * over `apiClient`. Decisions here are append-only — `mockDecide` flips status,
 * appends an audit entry, and the case drops out of the active queue.
 */
import type {
  ChecklistKey,
  KycAuditEntry,
  KycCase,
  KycCaseDetail,
  KycChecklistItem,
  KycDecisionInput,
  KycQueueParams,
} from "@/modules/kyc/types";

const CHECKLIST_TEMPLATE: Omit<KycChecklistItem, "checked">[] = [
  {
    key: "identity_ethics",
    title: "Identity & Ethical Sanity",
    description: "Is the identification valid and source of wealth ethical?",
  },
  {
    key: "bvn_haram_free",
    title: "BVN & Haram-Free Assets",
    description: "Asset check ensures no exposure to prohibited sectors.",
  },
  {
    key: "residency_zakat",
    title: "Residency & Zakat Status",
    description: "Verify local utility bill & optional Zakat deduction opt-in.",
  },
  {
    key: "pep_screening",
    title: "Politically Exposed Persons",
    description: "Global and Nigerian PEP screening for ethical integrity.",
  },
];

interface Row extends KycCase {
  application: string;
  nin: string;
  bvn: string;
  autoSummary: string;
  confidencePct: number;
  version: number;
  audit: KycAuditEntry[];
  decidedBy?: string;
  decidedAt?: string;
}

function seed(): Row[] {
  const base: Array<Partial<Row> & Pick<Row, "applicantName" | "tier" | "location" | "priority">> = [
    {
      applicantName: "Fatima Zahra Yusuf",
      tier: "Halal HNI",
      location: "Nassarawa, Kano",
      priority: "high_priority",
      application: "Halal Equity Portfolio Application",
    },
    {
      applicantName: "Musa Ibrahim",
      tier: "Tier 1",
      location: "Maitama, Abuja",
      priority: "standard",
      application: "Mudaraba Savings Application",
    },
    {
      applicantName: "Aisha Farouk",
      tier: "Tier 2",
      location: "Bompai, Kano",
      priority: "standard",
      application: "Sukuk Subscription",
    },
    {
      applicantName: "Ibrahim Balarabe",
      tier: "MSME",
      location: "Kaduna South, Kaduna",
      priority: "high_priority",
      application: "Murabaha Trade Facility",
    },
    {
      applicantName: "Hauwa Sani",
      tier: "Tier 1",
      location: "Gwarinpa, Abuja",
      priority: "standard",
      application: "Halal Equity Portfolio Application",
    },
  ];

  return base.map((entry, index) => ({
    id: `KYC-${(4821 + index).toString()}`,
    applicantName: entry.applicantName,
    applicantMemberId: `NG-${(22041 + index).toString()}`,
    tier: entry.tier,
    location: entry.location,
    priority: entry.priority,
    status: "reviewing",
    enqueuedAt: new Date(
      Date.now() - (index === 0 ? 12 : 72 + index * 30) * 60_000,
    ).toISOString(),
    application: entry.application ?? "Onboarding Application",
    nin: `5493 0${(291 + index).toString()} 44${index}`,
    bvn: `2213${(456789 + index).toString()}`,
    autoSummary:
      "NIN validated. BVN match confirmed (98% confidence). Applicant's business activities verified as Halal-compliant through SEC database.",
    confidencePct: 98 - index,
    version: 1,
    audit: [
      {
        id: `au-${index}-1`,
        at: new Date(Date.now() - 90 * 60_000).toISOString(),
        actor: "System",
        action: "Automated NIMC / BVN / SEC check completed",
      },
      {
        id: `au-${index}-2`,
        at: new Date(Date.now() - 40 * 60_000).toISOString(),
        actor: "Aniekan Obot",
        action: "Case opened for review",
      },
    ],
  }));
}

const store: Row[] = seed();

const delay = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms));

function toCase(row: Row): KycCase {
  return {
    id: row.id,
    applicantName: row.applicantName,
    applicantMemberId: row.applicantMemberId,
    tier: row.tier,
    location: row.location,
    priority: row.priority,
    status: row.status,
    enqueuedAt: row.enqueuedAt,
  };
}

export async function mockKycQueue(
  params: KycQueueParams,
): Promise<KycCase[]> {
  await delay();
  const search = params.search.trim().toLowerCase();
  const priorityRank = { high_priority: 0, standard: 1 };
  return store
    .filter((row) => row.status === "reviewing")
    .filter(
      (row) => params.priority === "all" || row.priority === params.priority,
    )
    .filter(
      (row) =>
        !search ||
        row.applicantName.toLowerCase().includes(search) ||
        row.id.toLowerCase().includes(search),
    )
    .sort(
      (a, b) =>
        priorityRank[a.priority] - priorityRank[b.priority] ||
        a.enqueuedAt.localeCompare(b.enqueuedAt),
    )
    .map(toCase);
}

export async function mockKycCase(id: string): Promise<KycCaseDetail> {
  await delay(200);
  const row = store.find((entry) => entry.id === id);
  if (!row) throw new Error("This case is no longer available.");
  return {
    ...toCase(row),
    application: row.application,
    nin: row.nin,
    bvn: row.bvn,
    documents: [
      {
        id: `${row.id}-nin`,
        label: `NIN_Slip_${row.applicantName.split(" ")[0]}.jpg`,
        kind: "nin",
        url: "",
      },
      { id: `${row.id}-poa`, label: "KEDCO_Bill_May.pdf", kind: "poa", url: "" },
    ],
    autoCheck: {
      status: row.confidencePct >= 95 ? "passed" : "flagged",
      confidencePct: row.confidencePct,
      summary: row.autoSummary,
    },
    checklist: CHECKLIST_TEMPLATE.map((item) => ({ ...item, checked: false })),
    notes: "",
    decidedBy: row.decidedBy,
    decidedAt: row.decidedAt,
    version: row.version,
  };
}

export async function mockKycAuditLog(id: string): Promise<KycAuditEntry[]> {
  await delay(150);
  const row = store.find((entry) => entry.id === id);
  return row ? [...row.audit].reverse() : [];
}

export async function mockDecideKycCase(
  input: KycDecisionInput,
): Promise<KycCaseDetail> {
  await delay();
  const row = store.find((entry) => entry.id === input.id);
  if (!row) throw new Error("This case is no longer available.");
  if (row.status !== "reviewing") {
    throw new Error("This case was already decided.");
  }
  if (row.version !== input.version) {
    throw new Error(
      "This case was updated elsewhere — review again before deciding.",
    );
  }

  row.status = input.decision;
  row.version += 1;
  row.decidedBy = "Aniekan Obot";
  row.decidedAt = new Date().toISOString();
  row.audit.push({
    id: `au-${row.id}-${row.audit.length + 1}`,
    at: row.decidedAt,
    actor: row.decidedBy,
    action: `Case ${input.decision}`,
    note: input.notes || undefined,
  });

  return mockKycCase(input.id);
}

export const KYC_CHECKLIST_KEYS: ChecklistKey[] = CHECKLIST_TEMPLATE.map(
  (item) => item.key,
);
