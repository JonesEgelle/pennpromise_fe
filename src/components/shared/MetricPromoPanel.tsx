import * as React from "react";

import { cn } from "@/lib/utils";

interface PromoStat {
  label: string;
  value: string;
}

interface MetricPromoPanelProps {
  title: string;
  body: string;
  /** Optional stat row (e.g. Proj. Growth / Est. Halal Rev. / Sharia Score). */
  stats?: PromoStat[];
  /** Optional action row (buttons). */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * The brand-coral highlight panel used for editorial callouts
 * ("Ethical Intelligence NG", "Sharia Q2 Outlook"). Always coloured — in dark
 * mode too — so it uses fixed on-brand foregrounds rather than theme tokens.
 */
export function MetricPromoPanel({
  title,
  body,
  stats,
  actions,
  className,
}: MetricPromoPanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 to-transparent"
        aria-hidden
      />
      <div className="relative space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="max-w-2xl text-sm text-primary-foreground/85">{body}</p>
        </div>

        {stats && stats.length > 0 ? (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-xl font-semibold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
