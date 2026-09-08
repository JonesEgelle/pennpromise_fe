/**
 * Small shared visual vocabulary for dashboard panels — accent tones used by
 * KPI mini-bars, bar lists, and gauges. Backed by the `--chart-*` tokens in
 * globals.css so both themes resolve; consumed through Tailwind classes.
 */

export type AccentTone = "blue" | "green" | "red" | "gold" | "neutral";

/** Solid fill for progress indicators / bars. */
export const ACCENT_FILL_CLASS: Record<AccentTone, string> = {
  blue: "bg-chart-blue",
  green: "bg-chart-green",
  red: "bg-chart-red",
  gold: "bg-chart-gold",
  neutral: "bg-foreground/70",
};
