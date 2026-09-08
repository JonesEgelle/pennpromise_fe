/**
 * In-memory Audit Trail store + async adapter (read-only).
 * TODO(api-contract): replace with `services/audit-trail.ts` over `apiClient`.
 */
import type {
  AuditAction,
  AuditEntry,
  AuditListParams,
  AuditStats,
} from "@/modules/auditTrail/types";
import type { PaginatedData } from "@/types/http";

const ADMINS = [
  { name: "Mustafa Al-Amin", id: "ADM-KAD-902" },
  { name: "Fatima Zahra", id: "ADM-KAN-441" },
  { name: "Ahmed Musa", id: "ADM-LAG-212" },
  { name: "Sharia Council Root", id: "SYS-SHARIA-NG" },
];
const ACTIONS: AuditAction[] = ["update", "security_login", "delete", "create"];
const MODULES = [
  "Halal Equity Screening",
  "Admin Identity",
  "Sukuk Bonds",
  "Compliance Certificate",
  "Role Matrix",
  "KYC Case",
];

function changeFor(action: AuditAction): AuditEntry["change"] {
  if (action === "update") {
    return { field: "debt_ratio", old: "0.33", new: "0.30" };
  }
  if (action === "delete") {
    return { field: "status", old: "draft", new: null };
  }
  if (action === "create") {
    return { field: "snapshot", old: null, new: "Automated Sukuk integrity snapshot" };
  }
  return null;
}

const store: AuditEntry[] = Array.from({ length: 42 }, (_, index) => {
  const admin = ADMINS[index % ADMINS.length];
  const action = ACTIONS[index % ACTIONS.length];
  return {
    id: `evt-${index + 1}`,
    at: new Date(
      Date.UTC(2026, 9, 27, 14, 22, 41) - index * 47 * 60_000,
    ).toISOString(),
    adminName: admin.name,
    adminId: admin.id,
    action,
    module: MODULES[index % MODULES.length],
    target:
      action === "security_login"
        ? "IP: 102.89.x.x (Kano)"
        : `NG_${MODULES[index % MODULES.length].split(" ")[0].toUpperCase()}_${index}`,
    change: changeFor(action),
    resourceType: ["role", "admin_user", "transaction", "sharia_record"][
      index % 4
    ],
  };
});

const delay = (ms = 260) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockAuditList(
  params: AuditListParams,
): Promise<PaginatedData<AuditEntry>> {
  await delay();
  const admin = params.admin.trim().toLowerCase();
  const moduleFilter = params.module.trim().toLowerCase();
  const filtered = store.filter((entry) => {
    if (params.action !== "all" && entry.action !== params.action) return false;
    if (admin && admin !== "all" && !entry.adminName.toLowerCase().includes(admin)) {
      return false;
    }
    if (
      moduleFilter &&
      moduleFilter !== "all" &&
      !entry.module.toLowerCase().includes(moduleFilter)
    ) {
      return false;
    }
    return true;
    // TODO(api-contract): startDate / endDate filtering.
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

export async function mockAuditStats(): Promise<AuditStats> {
  await delay(180);
  return {
    logsTracked: 1284,
    nonComplianceAlerts: 3,
    shariaCoveragePct: 90,
    monitoringLoad: [
      [0.3, 0.5, 0.4, 0.85, 1, 0.4, 0.2],
      [0.6, 0.35, 0.4, 0.45, 0.7, 0.3, 0.25],
    ],
  };
}

export const AUDIT_ADMIN_OPTIONS = [
  { value: "all", label: "All Administrators" },
  ...ADMINS.map((admin) => ({ value: admin.name, label: admin.name })),
];
export const AUDIT_MODULE_OPTIONS = [
  { value: "all", label: "All Modules" },
  ...MODULES.map((module) => ({ value: module, label: module })),
];
