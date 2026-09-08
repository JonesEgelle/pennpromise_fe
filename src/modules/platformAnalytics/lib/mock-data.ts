/**
 * Placeholder Platform Analytics data, shaped to types/index.ts and matching the
 * Figma design values.
 *
 * TODO(api-contract): replace with real per-panel TanStack queries + an export
 * mutation once the backend contract is confirmed (`npm run sync:schema`). This
 * module is presentational-only for v1.
 */
import {
  BadgeCheck,
  Clock,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Wallet,
} from "lucide-react";

import { APP_ROUTES } from "@/constants/routes";
import type { PlatformAnalyticsData } from "@/modules/platformAnalytics/types";

export const PLATFORM_ANALYTICS_MOCK: PlatformAnalyticsData = {
  kpis: [
    {
      id: "total-users",
      label: "Total Users",
      icon: UserRound,
      value: "124,592",
      delta: 12.4,
      accent: { percent: 62, tone: "blue" },
    },
    {
      id: "halal-aum",
      label: "Halal AUM (NGN)",
      icon: Wallet,
      value: "₦842.4B",
      delta: 12.4,
      accent: { percent: 34, tone: "blue" },
    },
    {
      id: "sukuk-volume",
      label: "Sukuk Volume",
      icon: TrendingUp,
      value: "₦1.8B",
      delta: -12.4,
      accent: { percent: 78, tone: "red" },
    },
    {
      id: "avg-session",
      label: "Avg Session",
      icon: Clock,
      value: "18m 45s",
      delta: 12.4,
      accent: { percent: 21, tone: "gold" },
    },
  ],
  trend: [
    { bucket: "Ramadan", halalUsers: 42, aum: 30 },
    { bucket: "Shawwal", halalUsers: 52, aum: 44 },
    { bucket: "Dhul Qadah", halalUsers: 58, aum: 55 },
    { bucket: "Dhul Hijjah", halalUsers: 74, aum: 63 },
    { bucket: "Muharram", halalUsers: 88, aum: 80 },
  ],
  investmentMix: {
    slices: [
      { label: "Sukuk Bonds (FGN/Corporate)", percent: 54, tone: "neutral" },
      { label: "Halal Equity Funds", percent: 22, tone: "blue" },
      { label: "Ijarah (Leasing) Assets", percent: 16, tone: "red" },
      { label: "Murabaha Trades", percent: 8, tone: "gold" },
    ],
    note: "“Sukuk oversubscription in Kano & Lagos drove 22% monthly AUM growth.”",
  },
  health: [
    {
      id: "kano-cluster",
      name: "Kano Server Cluster",
      detail: "Latency: 28ms",
      status: "live",
    },
    {
      id: "kaduna-db",
      name: "Main DB (Kaduna Replica)",
      detail: "Uptime: 99.998%",
      status: "live",
    },
    {
      id: "sharia-audit-bridge",
      name: "Sharia Audit Bridge",
      detail: "Compliance Verified",
      status: "live",
    },
  ],
  alerts: [
    {
      id: "NG-9822",
      severity: "high",
      source: "BVN Validation",
      issue: "Timeout for Zainab Ibrahim (#NG-9822)",
      resourceType: "kyc_case",
      resourceId: "NG-9822",
      createdAt: "2026-09-08T08:40:00+01:00",
    },
    {
      id: "alert-jaiz",
      severity: "medium",
      source: "Jaiz Bank Gateway",
      issue: "Delayed Mudaraba settlement response",
      resourceType: "transaction",
      createdAt: "2026-09-08T08:12:00+01:00",
    },
    {
      id: "alert-nin",
      severity: "info",
      source: "NIN Sync",
      issue: "Daily NIMC database synchronization complete",
      resourceType: "system_job",
      createdAt: "2026-09-08T06:00:00+01:00",
    },
    {
      id: "alert-sharia-docs",
      severity: "info",
      source: "Sharia Audit",
      issue: "Ahmad Yusuf updated Sukuk ownership docs",
      resourceType: "sharia_record",
      createdAt: "2026-09-08T05:30:00+01:00",
    },
  ],
  segments: [
    {
      id: "seg-hnw",
      name: "Usman Muhammad (HNW)",
      tier: "HNW",
      stats: "4% Users · 72% Sukuk AUM",
    },
    {
      id: "seg-retail",
      name: "Aisha Farouk (Retail)",
      tier: "Retail",
      stats: "68% Users · 18% Halal Eq.",
    },
    {
      id: "seg-msme",
      name: "Ibrahim Balarabe (MSME)",
      tier: "MSME",
      stats: "2% Users · 10% Murabaha",
    },
  ],
  outlook: {
    projGrowthPct: 24.8,
    estHalalRevNgn: 14_500_000_000,
    shariaScorePct: 100,
    narrative:
      "Driven by Ramadan capital shifts and Sukuk issuances, AUM is expected to hit ₦1.2T by end of Q2 with a focus on ethical infrastructure bonds.",
  },
  quickActions: [
    {
      id: "verify-bvn-nin",
      label: "Verify BVN/NIN",
      sublabel: "42 pending applications",
      href: APP_ROUTES.KYC,
      icon: BadgeCheck,
    },
    {
      id: "unblock-account",
      label: "Unblock Account",
      sublabel: "Manual security override",
      href: APP_ROUTES.USERS,
      icon: ShieldCheck,
    },
    {
      id: "sukuk-limits",
      label: "Sukuk Limits",
      sublabel: "Adjust NIF thresholds",
      href: APP_ROUTES.FINANCIAL_RECONCILIATION,
      icon: TrendingUp,
    },
    {
      id: "sharia-compliance",
      label: "Sharia Compliance",
      sublabel: "Zakat & Riba drill-down",
      href: APP_ROUTES.COMPLIANCE_MONITORING,
      icon: ShieldCheck,
    },
  ],
  network: {
    region: "(KANO/KADUNA)",
    uptimePct: 99.98,
    gauges: [
      { label: "Resource Utilization", percent: 58, tone: "red" },
      { label: "Sukuk Switch Response", percent: 92, tone: "blue" },
    ],
  },
};
