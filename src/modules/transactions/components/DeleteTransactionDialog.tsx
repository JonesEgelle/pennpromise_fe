"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared/Modal";
import { useDeleteTransaction } from "@/modules/transactions/controllers/transactionsController";
import type { Transaction } from "@/modules/transactions/types";

interface DeleteTransactionDialogProps {
  transaction: Transaction | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTransactionDialog({
  transaction,
  onOpenChange,
}: DeleteTransactionDialogProps) {
  const deleteTransaction = useDeleteTransaction();

  const onConfirm = () => {
    if (!transaction) return;
    deleteTransaction.mutate(transaction.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Modal
      open={Boolean(transaction)}
      onOpenChange={onOpenChange}
      title="Void transaction"
      description={
        transaction
          ? `${transaction.contractId} will be voided and removed from monitoring. The action is audited.`
          : ""
      }
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            isLoading={deleteTransaction.isPending}
            onClick={onConfirm}
          >
            Void transaction
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        Voiding is preferred over deletion for financial records — the entry is
        retained in the audit trail.
      </p>
    </Modal>
  );
}
