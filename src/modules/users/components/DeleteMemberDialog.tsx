"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared/Modal";
import { useDeleteMember } from "@/modules/users/controllers/usersController";
import type { Member } from "@/modules/users/types";

interface DeleteMemberDialogProps {
  member: Member | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteMemberDialog({
  member,
  onOpenChange,
}: DeleteMemberDialogProps) {
  const deleteMember = useDeleteMember();

  const onConfirm = () => {
    if (!member) return;
    deleteMember.mutate(member.memberId, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Modal
      open={Boolean(member)}
      onOpenChange={onOpenChange}
      title="Remove member"
      description={
        member
          ? `${member.firstName} ${member.lastName} (${member.memberId}) will be removed from the platform. This cannot be undone.`
          : ""
      }
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            isLoading={deleteMember.isPending}
            onClick={onConfirm}
          >
            Remove member
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        Consider restricting access instead if this is a compliance hold rather
        than a permanent removal.
      </p>
    </Modal>
  );
}
