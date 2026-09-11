/**
 * Small shared visual vocabulary for dashboard panels — accent tones used by
 * KPI mini-bars, bar lists, and gauges. Backed by the `--chart-*` tokens in
 * globals.css so both themes resolve; consumed through Tailwind classes.
 */

export type AccentTone =
  | "blue"
  | "navy"
  | "green"
  | "red"
  | "gold"
  | "neutral"
  | "yellow";

/** Solid fill for progress indicators / bars. */
export const ACCENT_FILL_CLASS: Record<AccentTone, string> = {
  blue: "bg-chart-blue",
  navy: "bg-chart-series-users",
  green: "bg-chart-green",
  red: "bg-chart-red",
  gold: "bg-chart-gold",
  yellow: "bg-chart-yellow",
  neutral: "bg-foreground/70",
};

/** Tinted chip (bg + icon colour) for KPI / stat tiles. */
export const ACCENT_CHIP_CLASS: Record<AccentTone, string> = {
  blue: "bg-chart-blue/10 text-chart-blue",
  navy: "bg-chart-series-users/10 text-chart-series-users",
  green: "bg-chart-green/10 text-chart-green",
  red: "bg-chart-red/10 text-chart-red",
  gold: "bg-chart-gold/10 text-chart-gold",
  yellow: "bg-chart-yellow/10 text-chart-yellow",
  neutral: "bg-muted text-muted-foreground",
};
