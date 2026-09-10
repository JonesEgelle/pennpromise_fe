import { Card } from "@/components/ui/card";
import { ChangePasscodeForm } from "@/modules/settings/components/security/ChangePasscodeForm";
import { ChangePasswordForm } from "@/modules/settings/components/security/ChangePasswordForm";
import { TwoFactorForm } from "@/modules/settings/components/security/TwoFactorForm";

export function SecurityTab() {
  return (
    <Card className="divide-y shadow-none divide-dashed divide-border overflow-hidden">
      <ChangePasswordForm />
      <ChangePasscodeForm />
      <TwoFactorForm />
    </Card>
  );
}
