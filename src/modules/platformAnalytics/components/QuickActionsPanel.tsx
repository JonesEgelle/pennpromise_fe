import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { QuickAction } from "@/modules/platformAnalytics/types";

export function QuickActionsPanel({ actions }: { actions: QuickAction[] }) {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-bold tracking-tight text-foreground">
        Quick Admin Actions
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.id}
              className="shadow-none rounded-[15px] border-none transition-colors hover:bg-muted/40"
            >
              <Link
                href={action.href}
                className="flex items-start gap-3 p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-chart-series-users">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-foreground">
                    {action.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {action.sublabel}
                  </span>
                </span>
              </Link>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
