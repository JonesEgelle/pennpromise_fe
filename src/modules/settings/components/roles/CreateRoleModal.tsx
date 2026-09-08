"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/shared/FormInput";
import { Modal } from "@/components/shared/Modal";
import { useCreateRole } from "@/modules/settings/controllers/settingsController";
import {
  createRoleSchema,
  type CreateRoleValues,
} from "@/modules/settings/lib/validators";

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY: CreateRoleValues = { name: "", description: "" };

export function CreateRoleModal({ open, onOpenChange }: CreateRoleModalProps) {
  const createRole = useCreateRole();
  const form = useForm<CreateRoleValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: EMPTY,
  });

  React.useEffect(() => {
    if (open) form.reset(EMPTY);
  }, [open, form]);

  const onSubmit = (values: CreateRoleValues) => {
    createRole.mutate(values, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create new role"
      description="The role starts with no permissions — grant them in the matrix."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="name"
            label="Role name"
            placeholder="Zonal Halal Risk Specialist"
          />
          <FormInput
            control={form.control}
            name="description"
            label="Description"
            placeholder="Regional Sharia risk oversight"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createRole.isPending}>
              Create role
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
