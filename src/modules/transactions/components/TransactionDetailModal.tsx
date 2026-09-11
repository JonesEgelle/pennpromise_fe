"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BankIcon } from "@/components/icons/action-icons";
import { Modal } from "@/components/shared/Modal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate, formatNairaAmount } from "@/lib/utils";
import { useTransaction } from "@/modules/transactions/controllers/transactionsController";
import type { Transaction } from "@/modules/transactions/types";

interface TransactionDetailModalProps {
  transactionId: string | null;
  onOpenChange: (open: boolean) => void;
}

function Field({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value || "—"}</dd>
    </div>
  );
}

function DetailBody({ transaction }: { transaction: Transaction }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {transaction.contractId}
        </span>
        <StatusBadge status={transaction.compliance} />
      </div>

      <section className="rounded-xl border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Contract Details
        </h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          <Field label="Contract ID" value={transaction.contractId} />
          <Field
            label="Timestamp"
            value={formatDate(transaction.timestamp, "datetime")}
          />
          <Field label="Client" value={transaction.client.name} />
          <Field label="BVN" value={transaction.client.bvnMasked} />
          <Field
            label="Product"
            value={
              <span className="flex items-center gap-2 capitalize">
                <BankIcon
                  className="size-4 text-muted-foreground"
                  aria-hidden
                />
                {transaction.product}
              </span>
            }
          />
          <Field
            label="Amount"
            value={
              <span className="font-medium">
                {formatNairaAmount(transaction.amountNgn)}
              </span>
            }
          />
          <Field
            label="Compliance"
            value={<StatusBadge status={transaction.compliance} />}
          />
          <Field
            label="Last Updated"
            value={formatDate(transaction.updatedAt, "datetime")}
          />
        </dl>
      </section>

      <p className="text-xs text-muted-foreground">
        Financial records are append-only. Corrections are made by amending the
        compliance state or voiding the entry - both are audited.
      </p>
    </div>
  );
}

export function TransactionDetailModal({
  transactionId,
  onOpenChange,
}: TransactionDetailModalProps) {
  const { data, isLoading, isError, error } = useTransaction(transactionId);

  return (
    <Modal
      open={Boolean(transactionId)}
      onOpenChange={onOpenChange}
      title={data ? data.contractId : "Transaction"}
      description={
        data ? "Transaction contract & compliance record" : undefined
      }
      className="max-w-lg"
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : isError ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "This transaction could not be loaded."}
        </p>
      ) : data ? (
        <DetailBody transaction={data} />
      ) : null}
    </Modal>
  );
}
