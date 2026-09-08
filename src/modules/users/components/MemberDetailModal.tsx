"use client";

import {
  CalendarClock,
  FileSearch,
  ShieldOff,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/shared/Modal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn, formatDate, formatNaira } from "@/lib/utils";
import { useMember, useUpdateMember } from "@/modules/users/controllers/usersController";
import type {
  MemberComplianceActionKind,
  MemberDetail,
} from "@/modules/users/types";

interface MemberDetailModalProps {
  memberId: string | null;
  onOpenChange: (open: boolean) => void;
}

const ACTION_ICON: Record<MemberComplianceActionKind, typeof CalendarClock> = {
  renew_certification: CalendarClock,
  audit_portfolio: UploadCloud,
  review_account: FileSearch,
  restrict_access: ShieldOff,
};

const HISTORY_DOT = {
  success: "bg-success",
  info: "bg-info",
  muted: "bg-muted-foreground",
} as const;

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value || "—"}</dd>
    </div>
  );
}

function DetailBody({ member }: { member: MemberDetail }) {
  const updateMember = useUpdateMember();

  const runAction = (kind: MemberComplianceActionKind) => {
    if (kind === "renew_certification") {
      updateMember.mutate({
        memberId: member.memberId,
        input: { certification: "sharia_certified" },
      });
      return;
    }
    if (kind === "restrict_access") {
      updateMember.mutate({
        memberId: member.memberId,
        input: { status: "suspended" },
      });
      return;
    }
    // TODO(api-contract): audit_portfolio / review_account are separate
    // compliance workflows — wire when specced.
    toast.success("Request queued.");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">{member.memberId}</span>
        <StatusBadge status={member.certification} />
        <StatusBadge status={member.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <section className="rounded-xl border border-border p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Profile Details
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Field label="First Name" value={member.firstName} />
              <Field label="Last Name" value={member.lastName} />
              <Field label="Location" value={member.location} />
              <Field
                label="Date of Birth"
                value={formatDate(member.dateOfBirth, "long")}
              />
              <Field label="Gender" value={member.gender} />
              <Field label="Marital Status" value={member.maritalStatus} />
              <Field label="Phone Number" value={member.phone} />
              <Field label="Email Address" value={member.email} />
              <Field label="Profession" value={member.profession} />
              <Field
                label="Member Since"
                value={formatDate(member.memberSince, "long")}
              />
            </dl>
          </section>

          <section className="rounded-xl border border-border p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Compliance History
            </h3>
            <ol className="space-y-3">
              {member.complianceHistory.map((entry) => (
                <li key={entry.id} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      HISTORY_DOT[entry.tone],
                    )}
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm text-foreground">{entry.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(entry.at, "datetime")}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-xl bg-primary p-5 text-primary-foreground">
            <p className="text-xs font-medium uppercase tracking-wide text-primary-foreground/80">
              Halal Assets Overview
            </p>
            <p className="mt-2 text-2xl font-semibold">
              ${member.halalAssets.totalUsd.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-primary-foreground/80">
              AB: ${member.halalAssets.benchmarkUsd.toLocaleString("en-US")} (
              {member.halalAssets.benchmarkDeltaPct >= 0 ? "+" : ""}
              {member.halalAssets.benchmarkDeltaPct}%)
            </p>
            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-primary-foreground/80">Equity</dt>
                <dd>{formatNaira(member.halalAssets.equityNgn)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-primary-foreground/80">Bonds</dt>
                <dd>{formatNaira(member.halalAssets.bondsNgn)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-border p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Compliance Action
            </h3>
            <div className="space-y-2">
              {member.complianceActions.map((action) => {
                const Icon = ACTION_ICON[action.kind];
                const destructive = action.kind === "restrict_access";
                return (
                  <button
                    key={action.id}
                    type="button"
                    disabled={updateMember.isPending}
                    onClick={() => runAction(action.kind)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50 disabled:opacity-50",
                      destructive && "text-destructive hover:bg-destructive-subtle",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function MemberDetailModal({
  memberId,
  onOpenChange,
}: MemberDetailModalProps) {
  const { data, isLoading, isError, error } = useMember(memberId);
  const updateMember = useUpdateMember();

  return (
    <Modal
      open={Boolean(memberId)}
      onOpenChange={onOpenChange}
      title={data ? `${data.firstName} ${data.lastName}` : "Member"}
      description={data ? "Member profile & compliance record" : undefined}
      className="max-w-4xl"
      footer={
        data ? (
          <>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Discard
            </Button>
            <Button
              isLoading={updateMember.isPending}
              onClick={() =>
                updateMember.mutate(
                  {
                    memberId: data.memberId,
                    input: { certification: "sharia_certified" },
                  },
                  { onSuccess: () => onOpenChange(false) },
                )
              }
            >
              Update Certification
            </Button>
          </>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : isError ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "This member could not be loaded."}
        </p>
      ) : data ? (
        <DetailBody member={data} />
      ) : null}
    </Modal>
  );
}
