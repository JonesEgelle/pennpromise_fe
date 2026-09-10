import { StatCard } from "@/components/shared/StatCard";
import type { AnalyticsKpi } from "@/modules/platformAnalytics/types";

export function KpiRow({ kpis }: { kpis: AnalyticsKpi[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <StatCard
          key={kpi.id}
          label={kpi.label}
          value={kpi.value}
          icon={kpi.icon}
          delta={kpi.delta}
          accent={kpi.accent}
          className="shadow-none"
        />
      ))}
    </div>
  );
}
