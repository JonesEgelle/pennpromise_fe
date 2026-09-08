"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect } from "@/components/shared/FormSelect";
import { Modal } from "@/components/shared/Modal";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/modules/transactions/controllers/transactionsController";
import {
  COMPLIANCE_OPTIONS,
  PRODUCT_OPTIONS,
  transactionFormSchema,
  type TransactionFormValues,
} from "@/modules/transactions/lib/validators";
import type { Transaction } from "@/modules/transactions/types";

interface TransactionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
}

const EMPTY: TransactionFormValues = {
  contractId: "",
  clientName: "",
  bvnMasked: "",
  product: "bonds",
  amount: "",
  compliance: "cleared",
};

export function TransactionFormModal({
  open,
  onOpenChange,
  transaction,
}: TransactionFormModalProps) {
  const isEdit = Boolean(transaction);
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const pending = createTransaction.isPending || updateTransaction.isPending;

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: EMPTY,
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset(
      transaction
        ? {
            contractId: transaction.contractId,
            clientName: transaction.client.name,
            bvnMasked: transaction.client.bvnMasked,
            product: transaction.product,
            amount: String(transaction.amountNgn),
            compliance: transaction.compliance,
          }
        : EMPTY,
    );
  }, [open, transaction, form]);

  const onSubmit = (values: TransactionFormValues) => {
    const input = {
      contractId: values.contractId,
      clientName: values.clientName,
      bvnMasked: values.bvnMasked,
      product: values.product,
      amountNgn: Number(values.amount),
      compliance: values.compliance,
    };
    if (transaction) {
      updateTransaction.mutate(
        { id: transaction.id, input },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createTransaction.mutate(input, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit transaction" : "Add new record"}
      description={
        isEdit
          ? `Amend ${transaction?.contractId}. Financial records are audited.`
          : "Record a transaction for monitoring."
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="contractId"
            label="Contract ID"
            placeholder="SK-67830000177"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              control={form.control}
              name="clientName"
              label="Client name"
              placeholder="John Doe"
            />
            <FormInput
              control={form.control}
              name="bvnMasked"
              label="Client BVN"
              placeholder="2221********918"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect
              control={form.control}
              name="product"
              label="Product"
              options={[...PRODUCT_OPTIONS]}
            />
            <FormInput
              control={form.control}
              name="amount"
              label="Amount (₦)"
              inputMode="numeric"
              placeholder="45000000"
            />
          </div>
          <FormSelect
            control={form.control}
            name="compliance"
            label="Compliance status"
            options={[...COMPLIANCE_OPTIONS]}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={pending}>
              {isEdit ? "Save changes" : "Add record"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
