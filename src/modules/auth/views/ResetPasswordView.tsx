"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/shared/FormInput";
import { AUTH_ROUTES } from "@/constants/routes";
import {
  AuthCard,
  AUTH_INPUT_CLASS,
} from "@/modules/auth/components/AuthCard";
import { useResetPassword } from "@/modules/auth/controllers/authController";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/modules/auth/lib/validators";

export function ResetPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const resetToken = searchParams.get("token") ?? "";
  const hasContext = Boolean(email && resetToken);

  const resetPassword = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPassword.mutate(
      { email, reset_token: resetToken, password: values.password },
      { onSuccess: () => router.replace(AUTH_ROUTES.SIGN_IN) },
    );
  };

  return (
    <AuthCard
      title="Create New Password"
      subtitle="Please create a new password to secure your account. Your new password must be different from your previous one."
      showBack
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="password"
            label="Create password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter password"
            className={AUTH_INPUT_CLASS}
          />
          <FormInput
            control={form.control}
            name="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter password"
            className={AUTH_INPUT_CLASS}
          />
          <Button
            type="submit"
            className="h-11 w-full"
            isLoading={resetPassword.isPending}
            disabled={!hasContext}
          >
            Continue
          </Button>
          {!hasContext ? (
            <p className="text-center text-sm text-destructive">
              This reset link is incomplete — please{" "}
              <Link href={AUTH_ROUTES.FORGOT_PASSWORD} className="underline">
                start again
              </Link>
              .
            </p>
          ) : null}
        </form>
      </Form>
    </AuthCard>
  );
}
