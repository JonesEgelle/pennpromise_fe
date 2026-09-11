"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { AutoCheckCard } from "@/modules/kyc/components/AutoCheckCard";
import { CaseAuditLogModal } from "@/modules/kyc/components/CaseAuditLogModal";
import { DocumentPreview } from "@/modules/kyc/components/DocumentPreview";
import { ShariaChecklist } from "@/modules/kyc/components/ShariaChecklist";
import {
  useDecideKycCase,
  useKycCase,
} from "@/modules/kyc/controllers/kycController";
import type {
  ChecklistKey,
  KycCaseDetail,
  KycDecision,
} from "@/modules/kyc/types";

interface CaseReviewPaneProps {
  caseId: string | null;
  onDecided: (decidedId: string) => void;
}

function CaseReviewForm({
  caseDetail,
  onDecided,
}: {
  caseDetail: KycCaseDetail;
  onDecided: (decidedId: string) => void;
}) {
  const [checklist, setChecklist] = React.useState(caseDetail.checklist);
  const [notes, setNotes] = React.useState("");
  const [noteError, setNoteError] = React.useState<string | null>(null);
  const decide = useDecideKycCase();

  const allChecked = checklist.every((item) => item.checked);

  const toggle = (key: ChecklistKey, checked: boolean) => {
    setChecklist((current) =>
      current.map((item) => (item.key === key ? { ...item, checked } : item)),
    );
  };

  const submit = (decision: KycDecision) => {
    if (decision === "rejected" && notes.trim().length < 3) {
      setNoteError("A note is required to reject a case.");
      return;
    }
    setNoteError(null);
    decide.mutate(
      {
        id: caseDetail.id,
        decision,
        notes: notes.trim(),
        checklistKeys: checklist
          .filter((item) => item.checked)
          .map((item) => item.key),
        version: caseDetail.version,
      },
      { onSuccess: () => onDecided(caseDetail.id) },
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,250px)_1fr] ">
        <div className="space-y-4">
          <DocumentPreview documents={caseDetail.documents} />
          <AutoCheckCard autoCheck={caseDetail.autoCheck} />
        </div>

        <div className="h-full space-y-5  ">
          <ShariaChecklist
            items={checklist}
            onToggle={toggle}
            disabled={decide.isPending}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="kyc-notes"
              className="text-sm font-medium text-text-secondary"
            >
              Compliance Officer Notes
            </label>
            <Textarea
              id="kyc-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add a note for the record…"
              aria-invalid={noteError ? true : undefined}
              disabled={decide.isPending}
              className="shadow-none"
            />
            {noteError ? (
              <p className="text-xs text-destructive">{noteError}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-end">
        {!allChecked ? (
          <p className="mr-auto text-xs text-muted-foreground">
            Complete every checklist item to approve.
          </p>
        ) : null}
        <Button
          variant="outline"
          isLoading={
            decide.isPending && decide.variables?.decision === "rejected"
          }
          disabled={decide.isPending}
          onClick={() => submit("rejected")}
        >
          Reject
        </Button>
        <Button
          isLoading={
            decide.isPending && decide.variables?.decision === "approved"
          }
          disabled={!allChecked || decide.isPending}
          onClick={() => submit("approved")}
        >
          Approve
        </Button>
      </div>
    </div>
  );
}

function DecidedNotice({ caseDetail }: { caseDetail: KycCaseDetail }) {
  return (
    <div className="grid h-full place-items-center">
      <div className="max-w-sm space-y-2 text-center">
        <p className="text-sm font-semibold capitalize text-foreground">
          Case {caseDetail.status}
        </p>
        <p className="text-sm text-muted-foreground">
          Decided by {caseDetail.decidedBy ?? "—"}
          {caseDetail.decidedAt
            ? ` · ${formatDate(caseDetail.decidedAt, "datetime")}`
            : ""}
          . This decision is final; corrections go through a re-open request.
        </p>
      </div>
    </div>
  );
}

export function CaseReviewPane({ caseId, onDecided }: CaseReviewPaneProps) {
  const [auditOpen, setAuditOpen] = React.useState(false);
  const { data, isLoading, isError, error } = useKycCase(caseId);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      {!caseId ? (
        <div className="grid flex-1 place-items-center p-6 text-center text-sm text-muted-foreground">
          Select a case from the queue to begin.
        </div>
      ) : isLoading ? (
        <div className="space-y-4 p-6">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : isError ? (
        <div className="grid flex-1 place-items-center p-6 text-center text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Could not load this case."}
        </div>
      ) : data ? (
        <>
          <div className="flex flex-col gap-3 border-b border-border bg-surface-muted p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-foreground">
                {data.applicantName}
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                NIN: {data.nin} · {data.application}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                onClick={() => setAuditOpen(true)}
                className="rounded-[10px] text-[14px] font-[400]"
              >
                Audit Log
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.message("Sharia profile — coming soon.")}
                className="rounded-[10px] text-[14px] font-[400]"
              >
                Sharia Profile
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
            {data.status === "reviewing" ? (
              <CaseReviewForm
                key={data.id}
                caseDetail={data}
                onDecided={onDecided}
              />
            ) : (
              <DecidedNotice caseDetail={data} />
            )}
          </div>

          <CaseAuditLogModal
            caseId={data.id}
            open={auditOpen}
            onOpenChange={setAuditOpen}
          />
        </>
      ) : null}
    </div>
  );
}
