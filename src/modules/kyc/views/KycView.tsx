"use client";

import * as React from "react";
import { ListFilter } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComplianceQueue } from "@/modules/kyc/components/ComplianceQueue";
import { CaseReviewPane } from "@/modules/kyc/components/CaseReviewPane";
import { useKycQueue } from "@/modules/kyc/controllers/kycController";
import { KYC_PRIORITY_FILTER_OPTIONS } from "@/modules/kyc/lib/validators";
import type { KycQueueParams } from "@/modules/kyc/types";

export function KycView() {
  const [priority, setPriority] =
    React.useState<KycQueueParams["priority"]>("all");
  const [shariaLink, setShariaLink] = React.useState(true);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const params: KycQueueParams = { priority, search: "" };
  const { data, isFetching } = useKycQueue(params);

  const queue = data ?? [];
  // Derive the active case: the user's pick if it is still in the queue,
  // otherwise the top of the queue. No effect needed.
  const activeId =
    selectedId && queue.some((item) => item.id === selectedId)
      ? selectedId
      : (queue[0]?.id ?? null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Compliance Queue
        </h1>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
            <ListFilter className="size-4" aria-hidden />
            Filter
          </span>
          <Select
            value={priority}
            onValueChange={(value) => {
              setPriority(value as KycQueueParams["priority"]);
              setSelectedId(null);
            }}
          >
            <SelectTrigger className="h-9 w-40">
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
      </div>

      <div className="gap-6 lg:grid lg:h-[calc(100vh-12rem)] lg:grid-cols-[360px_1fr]">
        <div className="mb-6 lg:mb-0 lg:min-h-0">
          <ComplianceQueue
            cases={data}
            isLoading={isFetching && !data}
            selectedId={activeId}
            onSelect={setSelectedId}
            shariaLink={shariaLink}
            onShariaLinkChange={setShariaLink}
          />
        </div>

        <div className="min-h-[520px] lg:min-h-0">
          <CaseReviewPane
            caseId={activeId}
            onDecided={() => setSelectedId(null)}
          />
        </div>
      </div>
    </div>
  );
}
