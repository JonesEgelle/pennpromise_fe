"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Circle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PasswordInput } from "@/modules/settings/components/security/PasswordInput";
import {
  SettingsField,
  SettingsSection,
} from "@/modules/settings/components/SettingsSection";
import { useSecurityMutation } from "@/modules/settings/controllers/settingsController";
import {
  PASSWORD_RULES,
  passwordChangeSchema,
  type PasswordChangeValues,
} from "@/modules/settings/lib/validators";

const EMPTY: PasswordChangeValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function StrengthChecklist({ value }: { value: string }) {
  return (
    <ul className="grid gap-1.5 sm:grid-cols-2">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(value);
        return (
          <li
            key={rule.label}
            className={cn(
              "flex items-center gap-1.5 text-xs",
              met ? "text-success" : "text-muted-foreground",
            )}
          >
            {met ? (
              <Check className="size-3.5" />
            ) : (
              <Circle className="size-3.5" />
            )}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

export function ChangePasswordForm() {
  const mutation = useSecurityMutation("Password updated.");
  const form = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: EMPTY,
    mode: "onChange",
  });
  const { errors } = form.formState;
  const newPassword = useWatch({ control: form.control, name: "newPassword" });

  const onSubmit = () => {
    mutation.mutate(undefined, { onSuccess: () => form.reset(EMPTY) });
  };

  return (
    <SettingsSection
      bare
      title="Change Password"
      description="Update your password here."
      actions={
        <>
          <Button
            variant="outline"
            onClick={() => form.reset(EMPTY)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            isLoading={mutation.isPending}
            disabled={!form.formState.isValid}
            onClick={form.handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </>
      }
    >
      <SettingsField label="Old Password" htmlFor="old-password">
        <PasswordInput
          id="old-password"
          autoComplete="current-password"
          {...form.register("oldPassword")}
          className="shadow-none"
        />
        {errors.oldPassword ? (
          <p className="text-xs text-destructive">
            {errors.oldPassword.message}
          </p>
        ) : null}
      </SettingsField>

      <SettingsField
        label="New Password"
        htmlFor="new-password"
        hint={<StrengthChecklist value={newPassword ?? ""} />}
      >
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          {...form.register("newPassword")}
          className="shadow-none"
        />
        {errors.newPassword ? (
          <p className="text-xs text-destructive">
            {errors.newPassword.message}
          </p>
        ) : null}
      </SettingsField>

      <SettingsField label="Confirm New Password" htmlFor="confirm-password">
        <PasswordInput
          id="confirm-password"
          autoComplete="new-password"
          {...form.register("confirmPassword")}
          className="shadow-none"
        />
        {errors.confirmPassword ? (
          <p className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </SettingsField>
    </SettingsSection>
  );
}
