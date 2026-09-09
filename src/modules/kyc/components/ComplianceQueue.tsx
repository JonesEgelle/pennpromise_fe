"use client";

import { ShieldCheck } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { QueueCaseCard } from "@/modules/kyc/components/QueueCaseCard";
import type { KycCase } from "@/modules/kyc/types";

interface ComplianceQueueProps {
  cases: KycCase[] | undefined;
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  shariaLink: boolean;
  onShariaLinkChange: (value: boolean) => void;
}

export function ComplianceQueue({
  cases,
  isLoading,
  selectedId,
  onSelect,
  shariaLink,
  onShariaLinkChange,
}: ComplianceQueueProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
        {isLoading && !cases ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-2xl" />
          ))
        ) : !cases || cases.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No cases awaiting review.
          </p>
        ) : (
          cases.map((kycCase) => (
            <QueueCaseCard
              key={kycCase.id}
              kycCase={kycCase}
              selected={kycCase.id === selectedId}
              onSelect={() => onSelect(kycCase.id)}
            />
          ))
        )}
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-[#F2F4F6] p-4">
        <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Sharia Link</p>
          <p className="text-[10px] text-[#454652B2] font-[400]">
            Ethical screening &amp; NIMC database sync{" "}
            {shariaLink ? "enabled" : "disabled"}.
          </p>
        </div>
        <Switch
          checked={shariaLink}
          onCheckedChange={onShariaLinkChange}
          aria-label="Toggle Sharia Link"
        />
      </div>
    </div>
  );
}
