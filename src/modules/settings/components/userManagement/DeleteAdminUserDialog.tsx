"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared/Modal";
import { useDeleteAdminUser } from "@/modules/settings/controllers/settingsController";
import type { AdminUser } from "@/modules/settings/types";

interface DeleteAdminUserDialogProps {
  adminUser: AdminUser | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAdminUserDialog({
  adminUser,
  onOpenChange,
}: DeleteAdminUserDialogProps) {
  const deleteUser = useDeleteAdminUser();

  const onConfirm = () => {
    if (!adminUser) return;
    // Double guard: the affordance is disabled for self / last-admin, and the
    // mutation re-checks server-side and rejects.
    if (adminUser.isSelf) return;
    deleteUser.mutate(adminUser.id, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Modal
      open={Boolean(adminUser)}
      onOpenChange={onOpenChange}
      title="Remove operator"
      description={
        adminUser
          ? `${adminUser.name} will lose access to the admin console. The action is audited.`
          : ""
      }
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            isLoading={deleteUser.isPending}
            onClick={onConfirm}
          >
            Remove operator
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        Suspend the account instead if this is temporary.
      </p>
    </Modal>
  );
}
