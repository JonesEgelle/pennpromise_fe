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
  useCreateAdminUser,
  useUpdateAdminUser,
} from "@/modules/settings/controllers/settingsController";
import {
  ADMIN_ROLE_OPTIONS,
  ADMIN_STATUS_OPTIONS,
  adminUserFormSchema,
  type AdminUserFormValues,
} from "@/modules/settings/lib/validators";
import type { AdminUser } from "@/modules/settings/types";

interface AdminUserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminUser?: AdminUser | null;
}

const EMPTY: AdminUserFormValues = {
  name: "",
  email: "",
  role: "Support Staff",
  department: "Administration",
  status: "invited",
};

export function AdminUserFormModal({
  open,
  onOpenChange,
  adminUser,
}: AdminUserFormModalProps) {
  const isEdit = Boolean(adminUser);
  const createUser = useCreateAdminUser();
  const updateUser = useUpdateAdminUser();
  const pending = createUser.isPending || updateUser.isPending;

  const form = useForm<AdminUserFormValues>({
    resolver: zodResolver(adminUserFormSchema),
    defaultValues: EMPTY,
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset(
      adminUser
        ? {
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
            department: adminUser.department,
            status: adminUser.status,
          }
        : EMPTY,
    );
  }, [open, adminUser, form]);

  const onSubmit = (values: AdminUserFormValues) => {
    if (adminUser) {
      updateUser.mutate(
        { id: adminUser.id, input: values },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createUser.mutate(values, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit operator" : "Add new operator"}
      description={
        isEdit
          ? `Update ${adminUser?.name}'s console access.`
          : "Grant a colleague access to the admin console."
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="name"
            label="Name"
            placeholder="John Paul"
          />
          <FormInput
            control={form.control}
            name="email"
            label="Email address"
            type="email"
            placeholder="john.paul@pennpromise.ng"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect
              control={form.control}
              name="role"
              label="Role"
              options={[...ADMIN_ROLE_OPTIONS]}
            />
            <FormInput
              control={form.control}
              name="department"
              label="Department"
              placeholder="Administration"
            />
          </div>
          <FormSelect
            control={form.control}
            name="status"
            label="Status"
            options={[...ADMIN_STATUS_OPTIONS]}
          />
          {adminUser?.isSelf ? (
            <p className="text-xs text-muted-foreground">
              This is your own account — you cannot change your role.
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={pending}>
              {isEdit ? "Save changes" : "Add operator"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
