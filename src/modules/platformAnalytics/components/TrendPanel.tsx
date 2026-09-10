import { SectionCard } from "@/components/shared/SectionCard";
import { TrendChart } from "@/components/shared/TrendChart";
import type { TrendPoint } from "@/modules/platformAnalytics/types";

const SERIES = [
  {
    key: "halalUsers",
    label: "Halal Users",
    color: "var(--chart-series-users)",
  },
  {
    key: "aum",
    label: "AUM (₦)",
    color: "var(--chart-series-aum)",
    dashed: true,
  },
] as const;

function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      {SERIES.map((entry) => (
        <span key={entry.key} className="flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ background: entry.color }}
            aria-hidden
          />
          {entry.label}
        </span>
      ))}
    </div>
  );
}

export function TrendPanel({ trend }: { trend: TrendPoint[] }) {
  return (
    <SectionCard
      title="Halal Growth & Sukuk AUM (NGN) Trends"
      action={<Legend />}
      className="shadow-none rounded-[15px]"
    >
      <TrendChart
        data={trend}
        xKey="bucket"
        series={SERIES.map((entry) => ({ ...entry }))}
        height={300}
      />
    </SectionCard>
  );
}
