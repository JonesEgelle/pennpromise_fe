import { BadgeCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { KycAutoCheck } from "@/modules/kyc/types";

const STATUS_META: Record<
  KycAutoCheck["status"],
  { label: string; variant: "success" | "warning" | "destructive" | "info" }
> = {
  pending: { label: "Running", variant: "info" },
  passed: { label: "Passed", variant: "success" },
  flagged: { label: "Flagged", variant: "warning" },
  failed: { label: "Failed", variant: "destructive" },
};

export function AutoCheckCard({ autoCheck }: { autoCheck: KycAutoCheck }) {
  const meta = STATUS_META[autoCheck.status];
  return (
    <section className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BadgeCheck className="size-4 text-primary" aria-hidden />
          NIMC &amp; Sharia Compliance Check
        </span>
        <Badge variant={meta.variant}>{meta.label}</Badge>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {autoCheck.summary}
      </p>
    </section>
  );
}
