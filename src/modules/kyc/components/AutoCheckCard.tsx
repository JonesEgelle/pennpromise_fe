import { Badge } from "@/components/ui/badge";
import { VerifiedSealIcon } from "@/components/icons/status-icons";
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
    <section className="rounded-[15px] border border-border bg-muted/30 p-4">
      <div className="flex gap-2">
        <VerifiedSealIcon
          className="size-5 shrink-0 text-foreground"
          aria-hidden
        />
        <div className="flex flex-col gap-2">
          <p className=" text-[16px] font-bold text-foreground">
            NIMC &amp; Sharia <br /> Compliance Check
          </p>
          {/* <Badge variant={meta.variant}>{meta.label}</Badge> */}
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {autoCheck.summary}
          </p>
        </div>
      </div>
    </section>
  );
}
