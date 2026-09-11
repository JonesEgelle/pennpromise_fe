"use client";

import { useRouter } from "next/navigation";
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
      title="Forgot Password?"
      subtitle="Request Password Reset"
      showBack
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="Enter email address"
            className={AUTH_INPUT_CLASS}
          />
          <Button
            type="submit"
            className="h-11 w-full"
            isLoading={forgotPassword.isPending}
          >
            Request Reset
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
