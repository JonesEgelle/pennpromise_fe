"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/shared/FormInput";
import { AUTH_ROUTES, APP_ROUTES } from "@/constants/routes";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import { useLogin } from "@/modules/auth/controllers/authController";
import {
  loginSchema,
  type LoginFormValues,
} from "@/modules/auth/lib/validators";

export function SignInView() {
  const router = useRouter();
  const login = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => router.replace(APP_ROUTES.PLATFORM_ANALYTICS),
    });
  };

  return (
    <AuthCard
      title="Sign in"
      subtitle="Access the PennPromise Capital admin console."
      footer={
        <Link
          href={AUTH_ROUTES.FORGOT_PASSWORD}
          className="text-info hover:underline"
        >
          Forgot your password?
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
          <FormInput
            control={form.control}
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
          />
          <Button
            type="submit"
            className="w-full"
            isLoading={login.isPending}
          >
            Sign in
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
