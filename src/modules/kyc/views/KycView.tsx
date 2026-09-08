"use client";

import * as React from "react";

import { PageHeader } from "@/components/shared/PageHeader";
import { ComplianceQueue } from "@/modules/kyc/components/ComplianceQueue";
import { CaseReviewPane } from "@/modules/kyc/components/CaseReviewPane";
import { useKycQueue } from "@/modules/kyc/controllers/kycController";
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
      <PageHeader
        title="Compliance Queue"
        description="Review KYC & Sharia onboarding cases, then approve or reject."
      />

      <div className="gap-6 lg:grid lg:h-[calc(100vh-12rem)] lg:grid-cols-[360px_1fr]">
        <div className="mb-6 lg:mb-0 lg:min-h-0">
          <ComplianceQueue
            cases={data}
            isLoading={isFetching && !data}
            selectedId={activeId}
            onSelect={setSelectedId}
            priority={priority}
            onPriorityChange={(value) => {
              setPriority(value);
              setSelectedId(null);
            }}
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
