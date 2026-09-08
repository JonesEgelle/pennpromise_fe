/**
 * In-memory System Health store + async adapter.
 * TODO(api-contract): replace with `services/system-health.ts` over apiClient.
 */
import type { SystemHealthData } from "@/modules/systemHealth/types";

const HUB_NODES = [
  { key: "kano", label: "Kano Hub" },
  { key: "lagos", label: "Lagos DC" },
  { key: "ph", label: "PH Edge" },
  { key: "abuja", label: "Abuja Cluster" },
];

let alerts: SystemHealthData["alerts"] = [
  {
    id: "al-1",
    severity: "critical",
    title: "PH Edge: Mudarabah Sync Drop",
    description:
      "Fiber route to PH Edge down. Secondary audit trail delayed. Switching to backup sync.",
    at: "2 min ago",
    actions: ["acknowledge", "audit_status"],
  },
  {
    id: "al-2",
    severity: "warning",
    title: "Lagos DC: Valuation Lag",
    description: "Market data pricing for bonds delayed. Manual verification active.",
    at: "14 min ago",
    actions: ["acknowledge", "dismiss"],
  },
  {
    id: "al-3",
    severity: "info",
    title: "Kano Cluster: ETF",
    description:
      "Added 3 new Sharia-vetted equity indexes to the Kano North cluster.",
    at: "1h ago",
    actions: ["dismiss"],
  },
];

const base: Omit<SystemHealthData, "alerts"> = {
  lastSync: "14:22:05 WAT",
  nodes: [
    {
      id: "kano-load",
      label: "Kano DC Load",
      value: "42.8%",
      delta: 2.4,
      bars: [30, 45, 40, 60, 75, 55, 50, 45, 80, 65],
    },
    {
      id: "lagos-memory",
      label: "Lagos Hub Memory",
      value: "12.4 GB",
      delta: 8.1,
      bars: [40, 42, 45, 50, 55, 60, 62, 58, 64, 60],
    },
    {
      id: "abuja-traffic",
      label: "Abuja Edge Traffic",
      value: "842 Mbps",
      delta: -1.2,
      bars: [25, 35, 30, 50, 70, 85, 65, 55, 60, 58],
    },
  ],
  hubNodes: HUB_NODES,
  hubRows: [
    {
      product: "Halal Equity Fund",
      statuses: { kano: "ok", lagos: "ok", ph: "ok", abuja: "ok" },
      uptimePct: 100,
    },
    {
      product: "Bonds",
      statuses: { kano: "ok", lagos: "warn", ph: "ok", abuja: "ok" },
      uptimePct: 99.98,
    },
    {
      product: "Savings",
      statuses: { kano: "ok", lagos: "ok", ph: "error", abuja: "ok" },
      uptimePct: 98.42,
    },
    {
      product: "Management Service",
      statuses: { kano: "ok", lagos: "ok", ph: "ok", abuja: "ok" },
      uptimePct: 99.99,
    },
    {
      product: "Commodity Trade",
      statuses: { kano: "ok", lagos: "ok", ph: "ok", abuja: "ok" },
      uptimePct: 100,
    },
  ],
  hubFooter: {
    advisoryRespMs: 124,
    advisoryDeltaMs: -12,
    nonComplianceRiskPct: 0.02,
    nonComplianceDeltaPct: 0.005,
  },
  distribution: { hotspot: "Kano State", volume: "450k req/sec" },
  localHealth: [
    { label: "Registry (Kano)", percent: 99.9, statusLabel: "Compliant", tone: "green" },
    { label: "Ethical Identity Gateway", percent: 82.1, statusLabel: "Audited", tone: "gold" },
    { label: "Sharia Board Ledger", percent: 100, statusLabel: "Verified", tone: "green" },
    { label: "Local Node (Lagos)", percent: 98.5, statusLabel: "Healthy", tone: "green" },
  ],
};

const delay = (ms = 240) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockSystemHealth(): Promise<SystemHealthData> {
  await delay();
  return { ...base, alerts: alerts.map((alert) => ({ ...alert })) };
}

export async function mockResolveAlert(id: string): Promise<void> {
  await delay(150);
  alerts = alerts.filter((alert) => alert.id !== id);
}

export async function mockClearAlerts(): Promise<void> {
  await delay(150);
  alerts = [];
}
