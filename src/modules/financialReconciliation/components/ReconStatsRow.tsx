import { Card } from "@/components/ui/card";
import { StatDeltaBadge } from "@/components/shared/StatDeltaBadge";
import type { ReconStatTile } from "@/modules/financialReconciliation/types";

export function ReconStatsRow({ stats }: { stats: ReconStatTile[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {stats.map((tile) => (
        <Card key={tile.id} className="space-y-3 p-5">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-normal text-foreground">
              {tile.label}
            </p>
            {tile.priority ? (
              <span className="rounded-full bg-success-subtle px-2 py-0.5 text-[10px] font-semibold uppercase text-success">
                Priority
              </span>
            ) : (
              <StatDeltaBadge value={tile.delta} />
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">
            {tile.value}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              {tile.sub}
            </span>
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[#000666]"
              style={{ width: `${tile.progress}%` }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
