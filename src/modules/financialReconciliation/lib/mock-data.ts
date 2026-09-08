/**
 * In-memory Financial Reconciliation store + async adapter.
 * TODO(api-contract): replace with `services/financial-reconciliation.ts`.
 */
import type {
  ReconFlag,
  ReconLedger,
  ReconOverview,
  ReconResolutionReason,
} from "@/modules/financialReconciliation/types";

const flags: ReconFlag[] = [
  {
    id: "TXN-NG-98422-ZA",
    kind: "coupon_mismatch",
    title: "Sukuk Coupon Mismatch",
    txnId: "TXN-NG-98422-ZA",
    at: new Date(Date.now() - 2 * 60_000).toISOString(),
    internalLabel: "Internal (Halal)",
    internalAmount: 850_000,
    providerLabel: "Jaiz Bank",
    providerAmount: 820_000,
  },
  {
    id: "TXN-NG-10023-BQ",
    kind: "missing_log",
    title: "Missing Compliance Log",
    txnId: "TXN-NG-10023-BQ",
    at: new Date(Date.now() - 15 * 60_000).toISOString(),
    internalLabel: "Internal",
    internalAmount: null,
    providerLabel: "Taj Bank",
    providerAmount: 45_000,
  },
  {
    id: "TXN-NG-88712-CC",
    kind: "duplicate_entry",
    title: "Duplicate Entry",
    txnId: "TXN-NG-88712-CC",
    at: new Date(Date.now() - 60 * 60_000).toISOString(),
    internalLabel: "Internal",
    internalAmount: null,
    providerLabel: "—",
    providerAmount: null,
    note: "Detected 2 matching entries for Sukuk Al-Ijarah in internal database.",
  },
  {
    id: "TXN-NG-77341-DK",
    kind: "coupon_mismatch",
    title: "Sukuk Coupon Mismatch",
    txnId: "TXN-NG-77341-DK",
    at: new Date(Date.now() - 95 * 60_000).toISOString(),
    internalLabel: "Internal (Halal)",
    internalAmount: 1_200_000,
    providerLabel: "Lotus Bank",
    providerAmount: 1_180_000,
  },
];

const overview: ReconOverview = {
  periodLabel: "Period ending Oct 2023",
  flagsRemaining: 14,
  stats: [
    {
      id: "matched",
      label: "Total Halal Matched",
      value: "₦1,840.4M",
      sub: "/ 12,482 txns",
      delta: 12.4,
      priority: false,
      progress: 68,
    },
    {
      id: "review-pending",
      label: "Sharia Review Pending",
      value: "142",
      sub: "flags identified",
      delta: null,
      priority: true,
      progress: 24,
    },
    {
      id: "purified",
      label: "Purified Discrepancies",
      value: "891",
      sub: "this month",
      delta: null,
      priority: true,
      progress: 92,
    },
  ],
  flags: [],
};

const ledger: ReconLedger = {
  providerName: "Jaiz Bank",
  internal: Array.from({ length: 6 }, (_, index) => ({
    date: "12 Oct, 2026",
    id: "TXN-NG-98412",
    amount: 12_400,
    mismatch: index === 0,
  })),
  provider: Array.from({ length: 6 }, (_, index) => ({
    date: "12 Oct, 2026",
    id: "JAIZ_REF_98422",
    amount: index === 0 ? 20_000 : 12_400,
    mismatch: index === 0,
  })),
};

const delay = (ms = 260) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockReconOverview(): Promise<ReconOverview> {
  await delay();
  return { ...overview, flags: flags.map((flag) => ({ ...flag })) };
}

// TODO(api-contract): the real endpoint takes the flag id; the mock ledger is
// the same for every flag, so the id lives only in the query key.
export async function mockReconLedger(): Promise<ReconLedger> {
  await delay(180);
  return {
    providerName: ledger.providerName,
    internal: ledger.internal.map((row) => ({ ...row })),
    provider: ledger.provider.map((row) => ({ ...row })),
  };
}

export async function mockResolveFlag(input: {
  flagId: string;
  reason: ReconResolutionReason;
}): Promise<void> {
  await delay();
  const index = flags.findIndex((flag) => flag.id === input.flagId);
  if (index >= 0) flags.splice(index, 1);
}

export async function mockSkipFlag(flagId: string): Promise<void> {
  await delay(150);
  const index = flags.findIndex((flag) => flag.id === flagId);
  if (index > -1) {
    const [flag] = flags.splice(index, 1);
    flags.push(flag);
  }
}

export const RECON_REASON_OPTIONS = [
  { value: "profit_sharing_adjustment", label: "Profit Sharing Adjustment" },
  { value: "rounding_adjustment", label: "Rounding Adjustment" },
  { value: "currency_conversion", label: "Currency Conversion" },
  { value: "manual_write_off", label: "Manual Write-off" },
] as const;
