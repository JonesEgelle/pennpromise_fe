"use client";

import { ListFilter, ShieldCheck } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QueueCaseCard } from "@/modules/kyc/components/QueueCaseCard";
import { KYC_PRIORITY_FILTER_OPTIONS } from "@/modules/kyc/lib/validators";
import type { KycCase, KycQueueParams } from "@/modules/kyc/types";

interface ComplianceQueueProps {
  cases: KycCase[] | undefined;
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  priority: KycQueueParams["priority"];
  onPriorityChange: (value: KycQueueParams["priority"]) => void;
  shariaLink: boolean;
  onShariaLinkChange: (value: boolean) => void;
}

export function ComplianceQueue({
  cases,
  isLoading,
  selectedId,
  onSelect,
  priority,
  onPriorityChange,
  shariaLink,
  onShariaLinkChange,
}: ComplianceQueueProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
          <ListFilter className="size-4" aria-hidden />
          Filter
        </span>
        <Select
          value={priority}
          onValueChange={(value) =>
            onPriorityChange(value as KycQueueParams["priority"])
          }
        >
          <SelectTrigger className="h-8 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {KYC_PRIORITY_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {isLoading && !cases ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-xl" />
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

      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Sharia Link</p>
          <p className="text-xs text-muted-foreground">
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
