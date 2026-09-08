import { ChangePasscodeForm } from "@/modules/settings/components/security/ChangePasscodeForm";
import { ChangePasswordForm } from "@/modules/settings/components/security/ChangePasswordForm";
import { TwoFactorForm } from "@/modules/settings/components/security/TwoFactorForm";

export function SecurityTab() {
  return (
    <div className="space-y-6">
      <ChangePasswordForm />
      <ChangePasscodeForm />
      <TwoFactorForm />
    </div>
  );
}
