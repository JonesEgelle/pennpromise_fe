import type { TrendRange } from "@/modules/platformAnalytics/types";

/**
 * Centralised query keys for the platformAnalytics module. One key per panel so
 * each query fails / refetches independently (see the module dossier →
 * Observability). Wired to controllers once the API contract exists.
 */
export const ANALYTICS_QUERY_KEYS = {
  all: ["platform-analytics"] as const,
  summary: (range: TrendRange) =>
    ["platform-analytics", "summary", range] as const,
  trend: (range: TrendRange) =>
    ["platform-analytics", "trend", range] as const,
  investmentMix: () => ["platform-analytics", "investment-mix"] as const,
  health: () => ["platform-analytics", "health"] as const,
  alerts: () => ["platform-analytics", "alerts"] as const,
  segments: () => ["platform-analytics", "segments"] as const,
  outlook: () => ["platform-analytics", "outlook"] as const,
  network: () => ["platform-analytics", "network"] as const,
};
