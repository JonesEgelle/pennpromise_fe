/**
 * Platform Analytics module types — the entities from
 * docs/dossiers/platformAnalytics.md.
 *
 * TODO(api-contract): these are inferred from the Figma design. Validate against
 * the real backend (run `npm run sync:schema`) before wiring services /
 * controllers. v1 ships presentational only, fed by lib/mock-data.ts.
 */
import type { ComponentType } from "react";

import type { AccentTone } from "@/components/shared/visual";

/** Any icon component that accepts `className` — lucide or a project SVG. */
type IconComponent = ComponentType<{ className?: string }>;

export type TrendRange =
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "ytd";

export interface AnalyticsKpi {
  id: string;
  label: string;
  icon: IconComponent;
  /** Display-ready (the API may send a formatted string). */
  value: string;
  /** Period-over-period change; null → hide the badge. */
  delta: number | null;
  /** Optional mini-bar under the value. */
  accent?: { percent: number; tone: AccentTone };
}

/** Type alias (not interface) so it carries an implicit index signature and is
 *  assignable to the Recharts `Record<string, string | number>` data shape. */
export type TrendPoint = {
  bucket: string;
  halalUsers: number;
  aum: number;
};

export interface InvestmentMixSlice {
  label: string;
  percent: number;
  tone: AccentTone;
}

export type HealthStatus = "live" | "degraded" | "down";
export type HealthRollup = "operational" | "degraded" | "outage";

export interface SystemHealthComponentStatus {
  id: string;
  name: string;
  detail: string;
  status: HealthStatus;
}

export type AlertSeverity = "high" | "medium" | "info";

export interface ComplianceAlert {
  id: string;
  severity: AlertSeverity;
  source: string;
  issue: string;
  /** Drives the deep-link target — never collapse to one generic category. */
  resourceType: string;
  resourceId?: string;
  createdAt: string;
}

export type SegmentTier = "HNW" | "Retail" | "MSME";

export interface HalalSegment {
  id: string;
  name: string;
  tier: SegmentTier;
  stats: string;
}

export interface OutlookProjection {
  projGrowthPct: number;
  estHalalRevNgn: number;
  shariaScorePct: number;
  narrative: string;
}

export interface QuickAction {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  icon: IconComponent;
}

export interface NetworkGauge {
  label: string;
  percent: number;
  tone: AccentTone;
}

export interface NetworkPerformance {
  region: string;
  uptimePct: number;
  gauges: NetworkGauge[];
}

export interface PlatformAnalyticsData {
  kpis: AnalyticsKpi[];
  trend: TrendPoint[];
  investmentMix: { slices: InvestmentMixSlice[]; note: string };
  health: SystemHealthComponentStatus[];
  alerts: ComplianceAlert[];
  segments: HalalSegment[];
  outlook: OutlookProjection;
  quickActions: QuickAction[];
  network: NetworkPerformance;
}
