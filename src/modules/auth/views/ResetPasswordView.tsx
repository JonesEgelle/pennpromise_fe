"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/shared/FormInput";
import { AUTH_ROUTES } from "@/constants/routes";
import { AuthCard } from "@/modules/auth/components/AuthCard";
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
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
      footer={
        <Link href={AUTH_ROUTES.SIGN_IN} className="text-info hover:underline">
          Back to sign in
        </Link>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="password"
            label="New password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <FormInput
            control={form.control}
            name="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <Button
            type="submit"
            className="w-full"
            isLoading={resetPassword.isPending}
            disabled={!hasContext}
          >
            Update password
          </Button>
          {!hasContext ? (
            <p className="text-center text-sm text-destructive">
              This reset link is incomplete — please{" "}
              <Link
                href={AUTH_ROUTES.FORGOT_PASSWORD}
                className="underline"
              >
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
