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
  useCreateMember,
  useUpdateMember,
} from "@/modules/users/controllers/usersController";
import {
  MEMBER_CERTIFICATION_OPTIONS,
  MEMBER_STATUS_OPTIONS,
  memberFormSchema,
  type MemberFormValues,
} from "@/modules/users/lib/validators";
import type { Member } from "@/modules/users/types";

interface MemberFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present → edit that member; absent → create. */
  member?: Member | null;
}

const EMPTY: MemberFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  certification: "not_certified",
  status: "halal_active",
};

export function MemberFormModal({
  open,
  onOpenChange,
  member,
}: MemberFormModalProps) {
  const isEdit = Boolean(member);
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const pending = createMember.isPending || updateMember.isPending;

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: EMPTY,
  });

  // Re-seed when the target member (or open state) changes.
  React.useEffect(() => {
    if (!open) return;
    form.reset(
      member
        ? {
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            phone: member.phone ?? "",
            certification: member.certification,
            status: member.status,
          }
        : EMPTY,
    );
  }, [open, member, form]);

  const onSubmit = (values: MemberFormValues) => {
    const input = { ...values, phone: values.phone || undefined };
    if (member) {
      updateMember.mutate(
        { memberId: member.memberId, input },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMember.mutate(input, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit member" : "Add new member"}
      description={
        isEdit
          ? `Update ${member?.memberId}'s record.`
          : "Create a member record. An onboarding invite is sent separately."
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              control={form.control}
              name="firstName"
              label="First name"
              placeholder="Zainab"
            />
            <FormInput
              control={form.control}
              name="lastName"
              label="Last name"
              placeholder="Ibrahim"
            />
          </div>
          <FormInput
            control={form.control}
            name="email"
            label="Email address"
            type="email"
            placeholder="member@example.ng"
          />
          <FormInput
            control={form.control}
            name="phone"
            label="Phone number (optional)"
            placeholder="+234…"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect
              control={form.control}
              name="certification"
              label="Certification"
              options={[...MEMBER_CERTIFICATION_OPTIONS]}
            />
            <FormSelect
              control={form.control}
              name="status"
              label="Status"
              options={[...MEMBER_STATUS_OPTIONS]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={pending}>
              {isEdit ? "Save changes" : "Create member"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
