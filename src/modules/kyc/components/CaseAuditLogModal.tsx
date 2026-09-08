"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/shared/Modal";
import { formatDate } from "@/lib/utils";
import { useKycAuditLog } from "@/modules/kyc/controllers/kycController";

interface CaseAuditLogModalProps {
  caseId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Append-only audit entries for a case (latest first). */
export function CaseAuditLogModal({
  caseId,
  open,
  onOpenChange,
}: CaseAuditLogModalProps) {
  const { data, isLoading } = useKycAuditLog(caseId, open);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Audit log"
      description="Every action on this case, in order. Entries are immutable."
    >
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : !data || data.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No audit entries yet.
        </p>
      ) : (
        <ol className="space-y-3">
          {data.map((entry) => (
            <li
              key={entry.id}
              className="border-l-2 border-border pl-3 text-sm"
            >
              <p className="font-medium text-foreground">{entry.action}</p>
              <p className="text-xs text-muted-foreground">
                {entry.actor} · {formatDate(entry.at, "datetime")}
              </p>
              {entry.note ? (
                <p className="mt-1 text-xs text-text-secondary">
                  “{entry.note}”
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </Modal>
  );
}
