import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ACCENT_FILL_CLASS } from "@/components/shared/visual";
import type { NetworkPerformance } from "@/modules/platformAnalytics/types";

export function NetworkPerformancePanel({
  network,
}: {
  network: NetworkPerformance;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Network Performance {network.region}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {network.uptimePct}%{" "}
          <span className="text-xs font-medium uppercase text-muted-foreground">
            Up Time
          </span>
        </p>
        <div className="space-y-3">
          {network.gauges.map((gauge) => (
            <div key={gauge.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">{gauge.label}</span>
                <span className="font-medium text-foreground">
                  {gauge.percent}%
                </span>
              </div>
              <Progress
                value={gauge.percent}
                indicatorClassName={ACCENT_FILL_CLASS[gauge.tone]}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
