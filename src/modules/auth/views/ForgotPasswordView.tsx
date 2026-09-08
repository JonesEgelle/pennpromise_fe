"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/shared/FormInput";
import { AUTH_ROUTES } from "@/constants/routes";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import { useForgotPassword } from "@/modules/auth/controllers/authController";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/modules/auth/lib/validators";

export function ForgotPasswordView() {
  const router = useRouter();
  const forgotPassword = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPassword.mutate(values, {
      onSuccess: () =>
        router.push(
          `${AUTH_ROUTES.VERIFY_OTP}?email=${encodeURIComponent(values.email)}`,
        ),
    });
  };

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your account email and we'll send a 6-digit code."
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
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@pennpromise.com"
          />
          <Button
            type="submit"
            className="w-full"
            isLoading={forgotPassword.isPending}
          >
            Send reset code
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
