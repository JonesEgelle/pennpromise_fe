"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/modules/settings/components/security/PasswordInput";
import {
  SettingsField,
  SettingsSection,
} from "@/modules/settings/components/SettingsSection";
import { useSecurityMutation } from "@/modules/settings/controllers/settingsController";
import {
  passcodeChangeSchema,
  type PasscodeChangeValues,
} from "@/modules/settings/lib/validators";

const EMPTY: PasscodeChangeValues = {
  oldPasscode: "",
  newPasscode: "",
  confirmPasscode: "",
};

const FIELDS: {
  name: keyof PasscodeChangeValues;
  label: string;
  id: string;
}[] = [
  { name: "oldPasscode", label: "Old Passcode", id: "old-passcode" },
  { name: "newPasscode", label: "New Passcode", id: "new-passcode" },
  {
    name: "confirmPasscode",
    label: "Confirm New Passcode",
    id: "confirm-passcode",
  },
];

export function ChangePasscodeForm() {
  const mutation = useSecurityMutation("Transaction PIN updated.");
  const form = useForm<PasscodeChangeValues>({
    resolver: zodResolver(passcodeChangeSchema),
    defaultValues: EMPTY,
    mode: "onChange",
  });
  const { errors } = form.formState;

  const onSubmit = () => {
    mutation.mutate(undefined, { onSuccess: () => form.reset(EMPTY) });
  };

  return (
    <SettingsSection
      bare
      title="Change Passcode"
      description="Update your four digit transaction PIN."
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
      {FIELDS.map((field) => (
        <SettingsField key={field.name} label={field.label} htmlFor={field.id}>
          <PasswordInput
            id={field.id}
            inputMode="numeric"
            maxLength={4}
            autoComplete="off"
            className="shadow-none"
            {...form.register(field.name)}
          />
          {errors[field.name] ? (
            <p className="text-xs text-destructive">
              {errors[field.name]?.message}
            </p>
          ) : null}
        </SettingsField>
      ))}
    </SettingsSection>
  );
}
