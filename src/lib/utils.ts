import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, resolving conflicts. Use for every conditional class. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Locale-grouped integer, e.g. 124592 → "124,592". null/NaN → "—". */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-NG").format(value);
}

/** Compact number, e.g. 842_400_000_000 → "842.4B". */
export function formatCompactNumber(
  value: number,
  maximumFractionDigits = 1,
): string {
  return new Intl.NumberFormat("en-NG", {
    notation: "compact",
    maximumFractionDigits,
  }).format(value);
}

/**
 * NGN currency for display. Accepts a raw number (formatted compact with a ₦
 * prefix) or an already-formatted string (returned as-is — the API may send
 * display strings). null / "" / NaN → "—". Currency is config-driven per
 * CLAUDE.md; this is the single ₦ entry point.
 */
export function formatNaira(
  value: number | string | null | undefined,
): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string") return value;
  if (Number.isNaN(value)) return "—";
  return `₦${formatCompactNumber(value)}`;
}

/** Full NGN amount with grouping + 2dp, e.g. 45000000 → "₦45,000,000.00". */
export function formatNairaAmount(
  value: number | null | undefined,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    currencyDisplay: "symbol",
  }).format(value);
}

/** Signed percentage for deltas, e.g. 12.4 → "+12.4%", -3 → "−3%". */
export function formatSignedPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  const rounded = Math.round(value * 10) / 10;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "";
  return `${sign}${Math.abs(rounded)}%`;
}

type DateFormat = "short" | "long" | "relative" | "datetime";

/**
 * General-purpose date formatter. Co-located here (not a styling concern) so the
 * whole app has one date-rendering entry point.
 */
export function formatDate(
  value: string | number | Date | null | undefined,
  format: DateFormat = "short",
): string {
  if (value === null || value === undefined || value === "") return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  switch (format) {
    case "long":
      return date.toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "datetime":
      return date.toLocaleString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    case "relative": {
      const diffMs = date.getTime() - Date.now();
      const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
      const abs = Math.abs(diffMs);
      const minute = 60_000;
      const hour = 3_600_000;
      const day = 86_400_000;
      if (abs < hour) return rtf.format(Math.round(diffMs / minute), "minute");
      if (abs < day) return rtf.format(Math.round(diffMs / hour), "hour");
      return rtf.format(Math.round(diffMs / day), "day");
    }
    case "short":
    default:
      return date.toLocaleDateString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  }
}
