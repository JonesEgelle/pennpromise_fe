import Link from "next/link";
import { Calendar, Download, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MetricPromoPanel } from "@/components/shared/MetricPromoPanel";
import { PageHeader } from "@/components/shared/PageHeader";
import { APP_ROUTES } from "@/constants/routes";
import { formatNaira, formatSignedPercent } from "@/lib/utils";
import { ComplianceAlertsPanel } from "@/modules/platformAnalytics/components/ComplianceAlertsPanel";
import { HalalSegmentsPanel } from "@/modules/platformAnalytics/components/HalalSegmentsPanel";
import { InvestmentMixPanel } from "@/modules/platformAnalytics/components/InvestmentMixPanel";
import { KpiRow } from "@/modules/platformAnalytics/components/KpiRow";
import { NetworkPerformancePanel } from "@/modules/platformAnalytics/components/NetworkPerformancePanel";
import { QuickActionsPanel } from "@/modules/platformAnalytics/components/QuickActionsPanel";
import { SystemHealthPanel } from "@/modules/platformAnalytics/components/SystemHealthPanel";
import { TrendPanel } from "@/modules/platformAnalytics/components/TrendPanel";
import { PLATFORM_ANALYTICS_MOCK } from "@/modules/platformAnalytics/lib/mock-data";

// TODO(api-contract): swap the mock for per-panel TanStack queries + an export
// mutation once the backend contract is confirmed (see the module dossier).
const data = PLATFORM_ANALYTICS_MOCK;

export function PlatformAnalyticsView() {
  const { outlook } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Analytics"
        description="Real-time overview of Sharia-compliant growth, Halal assets (NGN), and ethical engagement."
        actions={
          <>
            {/* TODO(api-contract): range picker */}
            <Button variant="outline" size="sm" disabled>
              <Calendar className="size-4" />
              Last 30 Days
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={APP_ROUTES.AUDIT_TRAIL}>
                <ShieldCheck className="size-4" />
                Sharia Audit
              </Link>
            </Button>
            {/* TODO(api-contract): export mutation (pending/success/error/timeout) */}
            <Button size="sm" disabled>
              <Download className="size-4" />
              Export Compliance Report
            </Button>
          </>
        }
      />

      <KpiRow kpis={data.kpis} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendPanel trend={data.trend} />
        </div>
        <InvestmentMixPanel
          slices={data.investmentMix.slices}
          note={data.investmentMix.note}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <HalalSegmentsPanel segments={data.segments} />
        <div className="lg:col-span-2">
          <MetricPromoPanel
            title="Sharia Q2 Outlook"
            body={outlook.narrative}
            stats={[
              {
                label: "Proj. Growth",
                value: formatSignedPercent(outlook.projGrowthPct),
              },
              {
                label: "Est. Halal Rev.",
                value: formatNaira(outlook.estHalalRevNgn),
              },
              {
                label: "Sharia Score",
                value: `${outlook.shariaScorePct}%`,
              },
            ]}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SystemHealthPanel components={data.health} />
        <div className="lg:col-span-2">
          <ComplianceAlertsPanel alerts={data.alerts} />
        </div>
      </div>

      <QuickActionsPanel actions={data.quickActions} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MetricPromoPanel
            title="Ethical Intelligence NG"
            body="Our Northern-based AI models are monitoring 14,200+ concurrent sessions across Nigerian networks. Security protocols adjusted for improved detection of localized ethical risk patterns."
            actions={
              <>
                <Button
                  size="sm"
                  className="border border-white/40 bg-transparent text-primary-foreground hover:bg-white/15"
                >
                  Halal Analytics
                </Button>
                <Button
                  size="sm"
                  className="border border-white/40 bg-transparent text-primary-foreground hover:bg-white/15"
                >
                  Audit Logs
                </Button>
              </>
            }
          />
        </div>
        <NetworkPerformancePanel network={data.network} />
      </div>
    </div>
  );
}
