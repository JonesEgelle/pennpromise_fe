/**
 * In-memory Settings store (Roles & Permissions + Security) + async adapter.
 *
 * TODO(api-contract): replace each `mock*` body with a `services/settings.ts`
 * call over `apiClient`. Real password/passcode/TFA flows are backend-only.
 */
import type {
  AdminUser,
  ChangeLogEntry,
  NotificationPrefs,
  PermissionRow,
  Role,
  RoleDetail,
  RolesStats,
  SystemConfig,
  TfaSetup,
} from "@/modules/settings/types";
import type { PaginatedData } from "@/types/http";

const MODULES = [
  "Halal Equity (Naira)",
  "BVN & Sharia ID Validation",
  "Sukuk Transfer",
  "Sharia Board Reporting",
  "Zakat & Riba Screening",
  "Murabaha Facilities",
  "NIMC / NIN Sync",
  "Compliance Exports",
];

function fullMatrix(seed: number): PermissionRow[] {
  return MODULES.map((module, index) => {
    const on = (index + seed) % 3 !== 0;
    return {
      module,
      view: true,
      create: on,
      edit: on,
      delete: (index + seed) % 4 === 0,
      export: on,
      shariaMfa: index % 2 === 0 ? "mandatory" : "optional",
    };
  });
}

interface Row extends Role {
  matrix: PermissionRow[];
}

function toRole(row: Row): Role {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    mfa: row.mfa,
    version: row.version,
  };
}

const store: Row[] = [
  {
    id: "zonal-admin-north",
    name: "Zonal Admin (North)",
    description: "Regional Sharia System Access",
    mfa: "mandatory",
    version: 1,
    matrix: fullMatrix(0),
  },
  {
    id: "customer-relations-halal",
    name: "Customer Relations (Halal)",
    description: "Local Branch Ethical Support",
    mfa: "optional",
    version: 1,
    matrix: fullMatrix(1),
  },
  {
    id: "sharia-compliance-auditor",
    name: "Sharia Compliance Auditor",
    description: "Fatwa & BOFIA Review",
    mfa: "mandatory",
    version: 1,
    matrix: fullMatrix(2),
  },
  {
    id: "sukuk-forex-manager",
    name: "Sukuk & Forex Manager",
    description: "Halal Remittance Approval",
    mfa: "mandatory",
    version: 1,
    matrix: fullMatrix(3),
  },
  {
    id: "hal-market-analyst",
    name: "Hal Market Analyst",
    description: "Read-Only Sukuk Analytics",
    mfa: "optional",
    version: 1,
    matrix: fullMatrix(4),
  },
];

const changeLog: ChangeLogEntry[] = [
  {
    id: "cl-1",
    at: new Date(Date.now() - 2 * 60_000).toISOString(),
    title: "Updated Permission Matrix",
    detail:
      "Administrator (John Doe) modified Sharia Compliance Auditor permissions for the Sukuk Transfer module.",
    kind: "matrix_update",
  },
  {
    id: "cl-2",
    at: new Date(Date.now() - 2 * 60_000).toISOString(),
    title: "New Sharia Role Created",
    detail: "System added a new hierarchy level: Zonal Halal Risk Specialist.",
    kind: "role_created",
  },
  {
    id: "cl-3",
    at: new Date(Date.now() - 2 * 60_000).toISOString(),
    title: "Unauthorized Access Attempt",
    detail:
      "External API (key: KAN_8x_02) attempted to access 'Sharia Board Reporting' without proper 'Zonal Admin' headers. Flagged by Amina Yusuf.",
    kind: "unauthorized_access",
  },
];

const delay = (ms = 260) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockRoles(): Promise<Role[]> {
  await delay();
  return store.map(toRole);
}

export async function mockRoleDetail(id: string): Promise<RoleDetail> {
  await delay(180);
  const row = store.find((entry) => entry.id === id);
  if (!row) throw new Error("Role not found.");
  return { ...row, matrix: row.matrix.map((cell) => ({ ...cell })) };
}

export async function mockSaveRoleMatrix(input: {
  id: string;
  matrix: PermissionRow[];
  version: number;
}): Promise<RoleDetail> {
  await delay();
  const row = store.find((entry) => entry.id === input.id);
  if (!row) throw new Error("Role not found.");
  if (row.version !== input.version) {
    throw new Error(
      "This role was changed elsewhere — review and retry.",
    );
  }
  row.matrix = input.matrix.map((cell) => ({ ...cell }));
  row.version += 1;
  changeLog.unshift({
    id: `cl-${changeLog.length + 1}`,
    at: new Date().toISOString(),
    title: "Updated Permission Matrix",
    detail: `Administrator modified ${row.name} permissions.`,
    kind: "matrix_update",
  });
  return { ...row, matrix: row.matrix.map((cell) => ({ ...cell })) };
}

export async function mockCreateRole(input: {
  name: string;
  description: string;
}): Promise<Role> {
  await delay();
  const role: Row = {
    id: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: input.name,
    description: input.description,
    mfa: "optional",
    version: 1,
    matrix: MODULES.map((module) => ({
      module,
      view: false,
      create: false,
      edit: false,
      delete: false,
      export: false,
      shariaMfa: "optional",
    })),
  };
  store.push(role);
  changeLog.unshift({
    id: `cl-${changeLog.length + 1}`,
    at: new Date().toISOString(),
    title: "New Sharia Role Created",
    detail: `System added a new hierarchy level: ${input.name}.`,
    kind: "role_created",
  });
  return toRole(role);
}

export async function mockChangeLog(): Promise<ChangeLogEntry[]> {
  await delay(180);
  return [...changeLog];
}

export async function mockRolesStats(): Promise<RolesStats> {
  await delay(150);
  return {
    totalRoles: store.length + 7,
    ethicalPermissions: 184,
    mfaEnforced: store.filter((role) => role.mfa === "mandatory").length,
    auditFrequency: "Live",
  };
}

export async function mockTfaSetup(): Promise<TfaSetup> {
  await delay(150);
  return {
    secretKey: "L5AB4JM3XSWOVK6U23VHDJBWFTMGD5I3",
    otpauthUrl:
      "otpauth://totp/PennPromise:admin@pennpromise.ng?secret=L5AB4JM3XSWOVK6U23VHDJBWFTMGD5I3&issuer=PennPromise",
  };
}

export async function mockSecurityMutation(): Promise<{ ok: true }> {
  await delay();
  return { ok: true };
}

/* ---- Notifications ---- */

let notificationPrefs: NotificationPrefs = {
  email: false,
  phone: true,
  inApp: true,
};

export async function mockNotificationPrefs(): Promise<NotificationPrefs> {
  await delay(150);
  return { ...notificationPrefs };
}

export async function mockSaveNotificationPrefs(
  next: NotificationPrefs,
): Promise<NotificationPrefs> {
  await delay();
  notificationPrefs = { ...next };
  return { ...notificationPrefs };
}

/* ---- User Management (admin operators) ---- */

const DEPARTMENTS = ["Administration", "Compliance", "Operations", "Risk"];
const ADMIN_ROLES: AdminUser["role"][] = [
  "Super Admin",
  "Administrator",
  "Compliance Officer",
  "Support Staff",
  "Analyst",
];

const adminUsers: AdminUser[] = Array.from({ length: 33 }, (_, index) => ({
  id: index === 0 ? "adm-self" : `adm-${index}`,
  name: index === 0 ? "Aniekan Obot" : `John Paul ${index}`,
  email: index === 0 ? "aniekan@pennpromise.ng" : `john.paul${index}@pennpromise.ng`,
  role: index === 0 ? "Administrator" : ADMIN_ROLES[index % ADMIN_ROLES.length],
  department: DEPARTMENTS[index % DEPARTMENTS.length],
  lastLoginAt: `2025-03-${String((index % 27) + 1).padStart(2, "0")}T09:15:00+01:00`,
  status: index % 7 === 0 ? "suspended" : "active",
  isSelf: index === 0,
}));

export function isLastAdministrator(user: AdminUser): boolean {
  if (user.role !== "Administrator") return false;
  return adminUsers.filter((entry) => entry.role === "Administrator").length <= 1;
}

export interface AdminUserInput {
  name: string;
  email: string;
  role: AdminUser["role"];
  department: string;
  status: AdminUser["status"];
}

export async function mockListAdminUsers(params: {
  page: number;
  pageSize: number;
  search: string;
  status: AdminUser["status"] | "all";
}): Promise<PaginatedData<AdminUser>> {
  await delay();
  const search = params.search.trim().toLowerCase();
  const filtered = adminUsers.filter((user) => {
    if (params.status !== "all" && user.status !== params.status) return false;
    if (!search) return true;
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
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

export async function mockCreateAdminUser(
  input: AdminUserInput,
): Promise<AdminUser> {
  await delay();
  const user: AdminUser = {
    id: `adm-${adminUsers.length}`,
    ...input,
    lastLoginAt: null,
    isSelf: false,
  };
  adminUsers.unshift(user);
  return user;
}

export async function mockUpdateAdminUser(
  id: string,
  input: AdminUserInput,
): Promise<AdminUser> {
  await delay();
  const user = adminUsers.find((entry) => entry.id === id);
  if (!user) throw new Error("Operator not found.");
  if (user.isSelf && input.role !== "Administrator") {
    throw new Error("You cannot change your own role.");
  }
  if (user.role === "Administrator" && input.role !== "Administrator" && isLastAdministrator(user)) {
    throw new Error("The last Administrator cannot be demoted.");
  }
  Object.assign(user, input);
  return user;
}

export async function mockDeleteAdminUser(id: string): Promise<void> {
  await delay();
  const user = adminUsers.find((entry) => entry.id === id);
  if (!user) return;
  if (user.isSelf) throw new Error("You cannot remove your own account.");
  if (isLastAdministrator(user)) {
    throw new Error("The last Administrator cannot be removed.");
  }
  const index = adminUsers.indexOf(user);
  adminUsers.splice(index, 1);
}

/* ---- System Configuration ---- */

let systemConfig: SystemConfig = {
  general: {
    organisationName: "PennPromise Capital",
    timezone: "wat",
    baseCurrency: "ngn",
  },
  notifications: [
    { key: "pending_claims", label: "Email alerts for pending claims", enabled: true },
    { key: "policy_expirations", label: "SMS alerts for policy expirations", enabled: true },
    { key: "fraud_alerts", label: "Push notifications for fraud alerts", enabled: true },
    { key: "daily_digest", label: "Daily digest emails", enabled: true },
    { key: "realtime_payments", label: "Real-time payment notifications", enabled: true },
    { key: "contract_reminders", label: "Provider contract reminders", enabled: true },
  ],
  featureFlags: [
    {
      key: "sukuk_trading",
      label: "Sharia Compliant Sukuk Trading",
      description:
        "Enable trading of Sukuk (Islamic bonds) and Sharia-compliant investment certificates.",
      enabled: true,
    },
    {
      key: "halal_equity_screening",
      label: "HALAL_EQUITY_SCREENING",
      description:
        "Automated filtering of stocks based on Sharia-compliant ethical standards (No Riba, gambling, or alcohol).",
      enabled: true,
    },
    {
      key: "zakat_automated_calculator",
      label: "ZAKAT_AUTOMATED_CALCULATOR",
      description:
        "Enable automatic calculation and distribution of Zakat on qualified assets within the platform.",
      enabled: false,
    },
  ],
  advisoryChanges: Array.from({ length: 3 }, (_, index) => ({
    id: `adv-${index}`,
    authorizedUser: "Z. Bashir",
    adjustment: "Zakat Provision",
    previousStatus: "Inactive",
    newStatus: "Mandatory (Active)",
    at: "2026-10-23T16:45:01+01:00",
  })),
};

export async function mockSystemConfig(): Promise<SystemConfig> {
  await delay(180);
  return structuredClone(systemConfig);
}

export async function mockSaveSystemConfig(
  next: SystemConfig,
): Promise<SystemConfig> {
  await delay();
  systemConfig = structuredClone(next);
  return structuredClone(systemConfig);
}
